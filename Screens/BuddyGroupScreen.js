import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Switch, ScrollView } from 'react-native';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import StatusBarComponent from '../Components/StatusbarComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native';
import useAxios from '../Hooks/useAxios';
import { useTheme } from '@react-navigation/native';
import { getDeviceType } from 'react-native-device-info';
import EStyleSheet from 'react-native-extended-stylesheet';

let deviceType = getDeviceType();

const BuddyGroupScreen = ({ navigation, route }) => {

    const theme = useTheme();
    const { colors } = useTheme();

    const { groupId } = route.params;
    const isFocused = useIsFocused();
    const [groupData, setGroupData] = useState(null);

    const [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse, 
        _getUserData, 
        userData, 
        setUserData, 
        isData
    ] = useAxios();  

    useEffect(() => {
        if(responseType === 'getGroup') {
            if(responseData.error === 1) {
                if(responseData.data.length > 0) {
                    const matchLocals = async() => {
                        await AsyncStorage.getItem('localContacts').then((value) => {
                            value = value != null ? JSON.parse(value) : null;
                            for (var i = 0; i < value.length; i++) {
                                for (var j = 0; j < responseData.data[0].users.length; j++) {
                                    if (value[i].phone.includes(responseData.data[0].users[j].phone)) {
                                        responseData.data[0].users[j].name = value[i].name;
                                    } 
                                }
                            }
                        })
                    }
                    matchLocals();
                    responseData.data.filter(value => {
                        if(value.id === groupId) {
                            setGroupData(value);
                        }
                    })
                } else {
                    setGroupData('empty');
                }
            } else {
                setResponse(false);
            }
        }
    }, [responseData]);

    useEffect(() => {
        // getUserData removed - not needed for design showcase
    }, [])
    
    useEffect(() => {
        setGroupData(null);
        getGroupData('direct');
    }, [isFocused])

    const getGroupData = async(token) => {
        setGroupData({
            id: groupId,
            name: 'Dummy Detail Group',
            image: 'dummy.jpg',
            users: [
                { id: '1', name: 'Admin User', role: 'admin', image: 'dummy.jpg', phone: '123456' },
                { id: '2', name: 'Normal User', role: 'user', image: 'dummy.jpg', phone: '789012' }
            ]
        });
    }

    return (
        <View style={[styles.Container, {backgroundColor: colors.background}]}>
            <View style={[styles.TopBarStyle, {backgroundColor: colors.background}]}>
                <Text style={[styles.TopBarBtnText, {color: colors.pText}]}>Group Info</Text>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <AntDesign name="arrowleft" style={[styles.BackBtn, {color: colors.pText}]} />
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
                {
                    groupData === null ?
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator color={colors.pText} size='large' />
                    </View> :
                    <View style={{flex: 1}}>
                        {
                            groupData === 'empty' ?
                            <View style={{flex: 1}}>
                                <Text style={[styles.emptyText, {color: colors.pText}]}>Something went wrong</Text>
                            </View> :
                            <View style={styles.groupWrap}>
                                <TouchableOpacity onPress={() => {}}>
                                    <Image 
                                        source={require('../assets/profile-user.png')} 
                                        resizeMode='cover' 
                                        style={styles.GroupImg}
                                    />
                                </TouchableOpacity>
                                <View style={[styles.GroupInfo, {borderBottomColor: colors.lighter}]}>
                                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.GroupName, {color: colors.pText}]}>{groupData.name}</Text>
                                </View>
                                <View>
                                    <View style={[styles.GroupInfo, styles.GroupInfoVar, {borderBottomColor: colors.lighter}]}>
                                        <MaterialIcons 
                                            name="group" 
                                            style={[styles.BackBtn, {
                                                fontSize: 
                                                deviceType === 'Tablet' ? 
                                                EStyleSheet.value('12.5rem') :
                                                EStyleSheet.value('18rem'), 
                                                color: colors.pText
                                            }]} 
                                        />
                                        <Text style={[styles.GroupTitle, {color: colors.pText}]}>Participants</Text>
                                    </View>
                                    <FlatList
                                        data={groupData.users}
                                        keyExtractor={ (item, index) => item.id ? item.id.toString() : index.toString() }
                                        ListFooterComponent={ () => {
                                            return (
                                                <View style={{height: 40}}></View>
                                            )
                                        }}
                                        renderItem={ ({ item }) => {
                                            return (
                                                <TouchableOpacity 
                                                    style={[styles.ListItem, {borderBottomColor: colors.lighter}]}
                                                    onPress={() => {
                                                        navigation.navigate('Buddy', { id: item.id });
                                                    }}
                                                >
                                                    <View style={styles.ListItemBody}>
                                                        <Image 
                                                            source={require('../assets/profile-user.png')} 
                                                            resizeMode='cover' 
                                                            style={styles.ListItemImg}
                                                        />
                                                        <View style={styles.ListItemTextWrap}>
                                                            <Text style={[styles.ListItemText, {color: colors.pText}]} ellipsizeMode='tail' numberOfLines={1}>
                                                                {item.name}
                                                                {
                                                                    item.role === 'admin' ? ` (${item.role})` : null
                                                                }
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>      
                                            )
                                        }}
                                    />    
                                </View>
                            </View>
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}

const screenHeight = Dimensions.get('window').height;

const styles = EStyleSheet.create({
    Container: {
        flex: 1
    },
    TopBarStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        height: deviceType === 'Tablet' ? '46rem' : '50rem',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.075,
        shadowRadius: 3,
        elevation: 2,
    },
    TopBarBtnText: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        fontFamily: 'GTWalsheimProMedium',
        color: Colors.dark,
    },
    BackBtn: {
        fontSize: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    SlidePanel: {
        backgroundColor: '#fff',
        flex: 1
    },
    groupWrap: {
        flex: 1
    },
    GroupImg: {
        height: deviceType === 'Tablet' ? '140rem' : '200rem',
        width: '100%'
    },
    GroupInfo: {
        paddingVertical: deviceType === 'Tablet' ? '10rem' : '14rem',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderBottomWidth: 1,
    },
    GroupInfoVar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    GroupName: {
        fontSize: deviceType === 'Tablet' ? '12rem' : '18rem',
        fontFamily: 'GTWalsheimProBold',
    },
    GroupTitle: {
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProMedium',
        paddingLeft: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    ListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderBottomWidth: '1rem',
        paddingVertical: deviceType === 'Tablet' ? '9rem' : '14rem',
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    ListItemBody: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ListItemImg: {
        height: deviceType === 'Tablet' ? '30rem' : '42rem',
        width: deviceType === 'Tablet' ? '30rem' : '42rem',
        borderRadius: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    ListItemTextWrap: {
        marginLeft: deviceType === 'Tablet' ? '8rem' : '12rem',
        maxWidth: '85%'
    },
    ListItemText: {
        fontSize: deviceType === 'Tablet' ? '9.5rem' : '14rem',
        fontFamily: 'GTWalsheimProRegular',
    },
    ListItemSmText: {
        fontSize: deviceType === 'Tablet' ? '8rem' : '12rem'
    },
    ChevronIcon: {
        fontSize: deviceType === 'Tablet' ? '16rem' : '24rem',
        color: Colors.light
    },
    GroupLocation: {
        paddingHorizontal: deviceType === 'Tablet' ? '14rem' : '20rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: deviceType === 'Tablet' ? '8rem' : '12rem',
        borderBottomWidth: '1rem'
    },
    GroupLocationTextWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    GroupLocationText: {
        color: Colors.light,
        fontSize: deviceType === 'Tablet' ? '11rem' : '16rem',
        fontFamily: 'GTWalsheimProMedium',
        paddingLeft: deviceType === 'Tablet' ? '7rem' : '10rem',
    },
    emptyText: {
        textAlign: 'center',
        paddingVertical: deviceType === 'Tablet' ? '18rem' : '30rem',
    },
    BottomSheet: {
        paddingTop: deviceType === 'Tablet' ? '11rem' : '16rem',
        height: '100%',
        justifyContent: 'flex-start',
        borderTopLeftRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
        borderTopRightRadius: deviceType === 'Tablet' ? '14rem' : '20rem',
    },
    bsHeader: {
        height: deviceType === 'Tablet' ? '14rem' : '20rem',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: deviceType === 'Tablet' ? '8rem' : '12rem'
    },
    bsHandle: {
        height: deviceType === 'Tablet' ? '3.75rem' : '6rem',
        width: deviceType === 'Tablet' ? '32rem' : '50rem',
        borderRadius: '3rem'
    },
})

export default BuddyGroupScreen;