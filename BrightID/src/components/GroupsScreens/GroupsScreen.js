// @flow

import * as React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  RefreshControl,
  Text,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import fetchUserInfo from '@/actions/fetchUserInfo';
import { getGroupName, ids2connections, knownMemberIDs } from '@/utils/groups';
import FloatingActionButton from '@/components/Helpers/FloatingActionButton';
import { ORANGE, DEVICE_LARGE } from '@/utils/constants';
import GroupCard from './GroupCard';
import { NoGroups } from './NoGroups';
import { compareJoinedDesc } from './models/sortingUtility';

/**
 * Group screen of BrightID
 * Displays a search input and list of Group Cards
 */

type State = {
  refreshing: boolean,
};

const ITEM_HEIGHT = DEVICE_LARGE ? 94 : 80;
const ITEM_MARGIN = DEVICE_LARGE ? 11.8 : 6;

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT + ITEM_MARGIN,
  offset: (ITEM_HEIGHT + ITEM_MARGIN) * index,
  index,
});

export class GroupsScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    const { navigation, dispatch } = this.props;
    navigation.addListener('focus', () => {
      dispatch(fetchUserInfo());
    });
  }

  renderGroup = ({ item, index }) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        testID={`groupItem-${index}`}
        onPress={() => navigation.navigate('Members', { group: item })}
      >
        <GroupCard group={item} />
      </TouchableOpacity>
    );
  };

  onRefresh = async () => {
    try {
      const { dispatch } = this.props;
      this.setState({ refreshing: true });
      await dispatch(fetchUserInfo());
      this.setState({ refreshing: false });
    } catch (err) {
      console.log(err.message);
      this.setState({ refreshing: false });
    }
  };

  render() {
    const { navigation, groups, hasGroups } = this.props;

    return (
      <>
        <StatusBar
          barStyle="light-content"
          backgroundColor={ORANGE}
          animated={true}
        />
        <View style={styles.orangeTop} />
        <View style={styles.container} testID="groupsScreen">
          <View style={styles.mainContainer}>
            <View style={styles.mainContainer}>
              <FlatList
                style={styles.groupsContainer}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
                testID="groupsFlatList"
                data={groups}
                keyExtractor={({ id }, index) => id + index}
                renderItem={this.renderGroup}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                getItemLayout={getItemLayout}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                ListEmptyComponent={
                  hasGroups ? (
                    <Text testID="noMatchText" style={styles.emptyText}>
                      No group matches your search
                    </Text>
                  ) : (
                    <NoGroups navigation={navigation} />
                  )
                }
              />
            </View>
          </View>
          {groups.length > 0 && (
            <FloatingActionButton
              testID="addGroupBtn"
              onPress={() => navigation.navigate('GroupInfo')}
            />
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  orangeTop: {
    backgroundColor: ORANGE,
    height: DEVICE_LARGE ? 70 : 65,
    width: '100%',
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    borderTopLeftRadius: 58,

    marginTop: -58,
    zIndex: 10,
    overflow: 'hidden',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 8,
  },
  groupsContainer: {
    flex: 1,
  },
  moreIcon: {
    marginRight: 16,
  },
  emptyText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 20,
  },
});

function mapStateToProps(state) {
  const { groups: unfilteredGroups } = state.groups;
  const searchParam = state.groups.searchParam.toLowerCase();
  const hasGroups = unfilteredGroups.length > 0;

  // apply search filter to groups array
  // NOTE: If below sorting/filtering gets too expensive at runtime use memoized selectors / reselect

  let groups;
  if (searchParam !== '') {
    groups = unfilteredGroups.filter((group) => {
      if (getGroupName(group).toLowerCase().includes(searchParam)) {
        // direct group name match
        return true;
      } else {
        // check group members
        const allMemberNames = ids2connections(
          knownMemberIDs(group),
        ).map((member) => member.name.toLowerCase());
        for (const name of allMemberNames) {
          if (name.includes(searchParam)) {
            // stop looking if a match is found
            return true;
          }
        }
        return false;
      }
    });
  } else {
    groups = [...unfilteredGroups];
  }

  // sort groups by joined timestamp, newest first
  groups.sort(compareJoinedDesc);

  return { groups, hasGroups };
}

export default connect(mapStateToProps)(GroupsScreen);
