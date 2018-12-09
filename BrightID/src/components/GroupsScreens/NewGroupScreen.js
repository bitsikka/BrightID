// @flow

import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import Spinner from 'react-native-spinkit';
import Ionicon from 'react-native-vector-icons/Ionicons';
import SearchConnections from '../Connections/SearchConnections';
import ConnectionCard from '../Connections/ConnectionCard';
import { getConnections } from '../../actions/getConnections';
import store from '../../store';
import { creatNewGroup } from './actions';
import { NavigationEvents } from 'react-navigation';
import Material from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, {
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';
import { renderListOrSpinner } from '../Connections/renderConnections';
import { clearNewGroupCoFounders } from '../../actions/index';

/**
 * Connection screen of BrightID
 * Displays a search input and list of Connection Cards
 */

type Props = {
  connections: Array<{
    nameornym: string,
    id: number,
  }>,
  newGroupCoFounders: [],
  searchParam: string,
};

type State = {
  loading: boolean,
};
// header Button
const MaterialHeaderButton = (passMeFurther) => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={Material}
    iconSize={32}
    color="#fff"
  />
);
class NewGroupScreen extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => ({
    title: 'New Group',
  });

  state = {
    loading: true,
  };

  componentDidMount() {
    this.getConnections();
  }

  onWillBlur = () => {
    this.props.dispatch(clearNewGroupCoFounders());
  };

  getConnections = async () => {
    const { dispatch } = this.props;
    await dispatch(getConnections());
    this.setState({
      loading: false,
    });
  };

  filterConnections = () => {
    const { connections, searchParam } = this.props;
    return connections.filter((item) =>
      `${item.nameornym}`
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(searchParam.toLowerCase().replace(/\s/g, '')),
    );
  };

  renderActionComponent = (publicKey) => (
    <TouchableOpacity
      style={styles.moreIcon}
      onPress={this.handleUserOptions(publicKey)}
    >
      <View>
        <Ionicon size={37} name="ios-checkmark-circle-outline" color="#333" />
      </View>
    </TouchableOpacity>
  );

  cardIsSelected = (card) => {
    let { newGroupCoFounders } = this.props;
    for (let i in newGroupCoFounders)
      if (
        JSON.stringify(newGroupCoFounders[i]) === JSON.stringify(card.publicKey)
      )
        return true;
    return false;
  };

  renderConnection = ({ item }) => (
    <ConnectionCard
      {...item}
      selected={this.cardIsSelected(item)}
      groups={true}
      style={styles.connectionCard}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <NavigationEvents onWillBlur={(payload) => this.onWillBlur()} />
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>CO-FOUNDERS</Text>
            <Text style={styles.infoText}>
              To create a group, you must select two co-founders
            </Text>
          </View>
          <SearchConnections navigation={this.props.navigation} />
          <View style={styles.mainContainer}>{renderListOrSpinner(this)}</View>
        </View>
        <View style={styles.createGroupButtonContainer}>
          <TouchableOpacity
            onPress={async () => {
              // alert('new group');
              let result = await store.dispatch(creatNewGroup());
              console.log(result);
              if (result) navigation.goBack();
            }}
            style={styles.createGroupButton}
          >
            <Text style={styles.buttonInnerText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionsContainer: {
    flex: 1,
    width: '96.7%',
    borderTopWidth: 1,
    borderTopColor: '#e3e1e1',
  },

  moreIcon: {
    marginRight: 16,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#fff',
    width: '96.7%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e3e1e1',
    paddingTop: 11,
    paddingBottom: 11,
  },
  titleText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.09)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
  },
  connectionCard: {
    marginBottom: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e1e1',
    width: '100%',
  },
  createGroupButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createGroupButton: {
    backgroundColor: '#428BE5',
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 12,
    marginTop: 9,
    marginBottom: 7,
  },
  buttonInnerText: {
    fontFamily: 'ApexNew-Medium',
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default connect((state) => state.main)(NewGroupScreen);