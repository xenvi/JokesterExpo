import React, { Component } from "react";
import { View, RefreshControl, FlatList, StyleSheet, Animated } from "react-native";
// components
import JokesCard from "./JokesCard";

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);

export default class Jokes extends Component {
    refreshHandler = () => {
        this.props.onRefresh();
    }
    render() {
    // receive state from props
    const { jokesData, refreshing } = this.props.state;

    // scroll animation values
    const y = new Animated.Value(0);
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
        useNativeDriver: true,
    });

        return (
            <AnimatedFlatlist
                style={styles.flatList}
                data={jokesData}
                keyExtractor={item => item.id.toString()}
                CellRendererComponent={({ item, index }) =>
                    <JokesCard index={index} item={item} y={y} />
                }
                ListFooterComponent={
                    <View style={styles.flatlistBottomSpacing}>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={this.refreshHandler}
                    />
                  }
                scrollEventThrottle={16}
                {...{onScroll}}
            />
        );
    }
};

const styles = StyleSheet.create({
    flatList: {
        padding: 15
    },
    flatlistBottomSpacing: {
        padding: 50
    }
  });