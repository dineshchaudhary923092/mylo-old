import { useState, useContext } from 'react';
import { Api } from '../Constants/Api';
import { Colors } from '../Constants/Colors';
import { AuthContext } from '../Components/Context';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';

const qs = require('qs');
const axios = require('axios');

export default () => {

    const { logout } = useContext(AuthContext);

    const [responseData, setResponseData] = useState(null);
    const [response, setResponse] = useState(false);
    const [responseType, setResponseType] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isData, setIsData] = useState(false);
    const [userToken, setUserToken] = useState(null);

    const getData = async (headPoint, bodyData, rType, show) => {
        setResponseType(rType);
        
        // COMPLETELY MOCKED - bypassing all axios network calls across the App
        // This ensures bare design showcase without server configuration dependency
        
        let dummyResponse = {
            data: {
                error: 1, 
                msg: 'Success', 
                token: 'dummy-token',
                data: {
                    user: { id: 1, image: '' }
                }
            }
        };

        setResponseData(dummyResponse.data);
        setResponse(true);

        if(show) {
            showMessage({
                message: dummyResponse.data.msg,
                type: "success",
                duration: 3000,
                style: {
                    backgroundColor: Colors.dark
                },
                titleStyle: {
                    color: Colors.primary,
                    fontFamily: 'GTWalsheimProMedium'
                }
            });
        }
    }       

    const getUserData = async () => {
        setUserData({
            data: {
                user: {
                    id: 1,
                    name: 'Sarah Mitchell',
                    phone: '+1 (555) 234-8901',
                    image: null,
                    notifyMe: '10'
                }
            }
        });
        setUserToken('dummy-token');
        setIsData(true);
    }   

    return [
        getData, 
        responseData, 
        setResponseData, 
        responseType, 
        response, 
        setResponse, 
        getUserData, 
        userData, 
        setUserData, 
        isData, 
        userToken,
        setUserToken
    ];
}

