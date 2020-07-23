import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
// components
import Store from './Store';
// assets
import smile from '../assets/images/smile.png';
import frown from '../assets/images/frown.png';

export default class JokesCard extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
            disliked: false,
            likedBackgroundColor: 'rgba(0,0,0, 0.1)',
            dislikedBackgroundColor: 'rgba(0,0,0, 0.1)',
            height: 0,
            yWindow: 0,
            likeBtnScale: new Animated.Value(1),
            dislikeBtnScale: new Animated.Value(1),
        };
      }

      componentDidMount() {
        this._isMounted = true;
        // retrieve local data
          this.getStorageData();
      }

      componentWillUnmount() {
        this._isMounted = false;
      }

    handleLike = () => {
        // animate button
        Animated.sequence([
            Animated.timing(this.state.likeBtnScale, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(this.state.likeBtnScale, {
                toValue: 2,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(this.state.likeBtnScale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            })
        ]).start();

        // on like, if not already liked, change background green and reset dislike state
        // store state in local storage
        if (!this.state.liked) {
            if (this._isMounted) {
                this.setState({
                    liked: true,
                    disliked: false,
                    likedBackgroundColor: '#7DE4A6',
                    dislikedBackgroundColor: 'rgba(0,0,0, 0.1)'
                }, this.setStorageData)
            }
        }
    }
    handleDislike = () => {
        // animate button
        Animated.sequence([
            Animated.timing(this.state.dislikeBtnScale, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(this.state.dislikeBtnScale, {
                toValue: 2,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(this.state.dislikeBtnScale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            })
        ]).start();

        // on dislike, if not already disliked, change background red and reset 'like' state
        // store state in local storage
        if(!this.state.disliked) {
            if (this._isMounted) {
                this.setState({
                    liked: false,
                    disliked: true,
                    likedBackgroundColor: 'rgba(0,0,0, 0.1)',
                    dislikedBackgroundColor: '#FA8775'
                }, this.setStorageData)
            }
        }
    }

    // set current joke state in local storage
    setStorageData = async() => {
        const jokeId = this.props.item.id;
        try {
            await AsyncStorage.setItem(`Joke ${jokeId}`, JSON.stringify({
                liked: this.state.liked,
                disliked: this.state.disliked,
                likedBackgroundColor: this.state.likedBackgroundColor,
                dislikedBackgroundColor: this.state.dislikedBackgroundColor
            }));
        } catch (err) {
            console.log(err);
        }
    }

    // get stored joke states in local storage
    getStorageData = async() => {
        const jokeId = this.props.item.id;
        try {
            let currentState = await AsyncStorage.getItem(`Joke ${jokeId}`).then((res) => JSON.parse(res));
            if (currentState !== null && this._isMounted) {
                this.setState(currentState);
            }
        } catch(err) {
            console.log(err);
        }
    }

    // get height of card
    _onLayoutEvent = (event) => {
        this.setState({height: event.nativeEvent.layout.height, yWindow: event.nativeEvent.layout.y});
    }

    render() {
        const { index, item, y } = this.props;

        // animate flatlist
        const PADDING = 15;
        const CARD_HEIGHT = this.state.height + PADDING * 2;
        const { height: wHeight } = Dimensions.get("window");
        const height = wHeight;
        const flatlistYPosition = this.state.yWindow;
        const position = Animated.subtract(flatlistYPosition, y);
        const isDisappearing = -CARD_HEIGHT;
        const isTop = 0;
        const isBottom = height - CARD_HEIGHT;
        const isAppearing = height;
        const translateY = Animated.add(
            Animated.add(
                y,
                y.interpolate({
                    inputRange: [0, flatlistYPosition],
                    outputRange: [0, -flatlistYPosition],
                    extrapolateRight: "clamp",
                })
            ),
            position.interpolate({
                inputRange: [isBottom, isAppearing],
                outputRange: [0, -CARD_HEIGHT / 4],
                extrapolate: "clamp",
            }),
        );
        const scale = position.interpolate({
            inputRange: [isDisappearing, isTop, isBottom, isAppearing],
            outputRange: [0.5, 1, 1, 0.5],
            extrapolate: 'clamp',
        });
        const opacity = position.interpolate({
            inputRange: [isDisappearing, isTop, isBottom, isAppearing],
            outputRange: [0, 1, 1, 0],
            extrapolate: 'clamp',
        });

        // animate button
        const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);   
        const scaleLikeBtn = this.state.likeBtnScale.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0.7, 1, 1.1]
        });
        const scaleDislikeBtn = this.state.dislikeBtnScale.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0.7, 1, 1.1]
        })

        return (
            <Store.Consumer>
                {({changeHeader}) => (
                <Animated.View style={[styles.card, { opacity, transform: [{ translateY }, { scale }] }]} onLayout={this._onLayoutEvent} key={index}>
                    <Text style={styles.setup}>{item.setup}</Text>
                    <Text style={styles.punchline}>{item.punchline}</Text>
                    <View style={styles.row}>
                        <AnimatedTouchable
                            onPress={() => {this.handleDislike(); changeHeader("frown") }}
                            style={[styles.iconBtn, { backgroundColor: this.state.dislikedBackgroundColor, transform: [{scaleX: scaleDislikeBtn}, {scaleY: scaleDislikeBtn}] }]}>
                            <Image source={frown} style={styles.cardIcon} />
                        </AnimatedTouchable>
                        <AnimatedTouchable
                            onPress={() => {this.handleLike(); changeHeader("smile") }}
                            style={[styles.iconBtn, { backgroundColor: this.state.likedBackgroundColor, transform: [{scaleX: scaleLikeBtn}, {scaleY: scaleLikeBtn}] }]}
                            >
                            <Image source={smile} style={styles.cardIcon} />
                        </AnimatedTouchable>
                    </View>
                </Animated.View>
                )}
            </Store.Consumer>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconBtn: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 20
    },
    cardIcon: {
        transform: [{ scale: 0.5 }],
    },
    card: {
        backgroundColor: '#FFE6E2',
        width: '100%',
        height: 'auto',
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 20
    },
    setup: {
        fontFamily: 'Roboto-Medium',
        fontWeight: 'bold',
        fontSize: 16,
    },
    punchline: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 15
    }
  });