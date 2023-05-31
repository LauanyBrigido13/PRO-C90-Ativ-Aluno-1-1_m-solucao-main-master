import React, {Component} from "react";
import {Text, View, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, FlatList, ImageBackground, Dimensions, Image} from "react-native";
import axios from 'axios';

export default class MeteorScreen extends Component{
    
    constructor(props){
        super(props);
        this.state ={
            meteors: {}
        }
    }
    componentDidMount(){
    this.getMeteors();
}
    getMeteors = ()=>{
        axios
        .get('https://api.nasa.gov/neo/rest/v1/feed?&api_key=5bXVptYdKh2p7Y6KTxRxgbvL0df4X89FiMjsdh8B')
        .then((response)=>{this.setState({meteors: response.data.near_earth_objects})})
        .catch((error)=>{alert(error.message)})
    };
    renderItem = ({item})=>{
        let meteor = item;
        let bg_img, speed, size;

        if(meteor.threatScore <=30){
            bg_img = require('../assets/meteor_bg1.png');
            speed = require('../assets/meteor_speed1.gif');
            size = 100;
        }
        else if(meteor.threatScore <=75){
            bg_img = require('../assets/meteor_bg2.png');
            speed = require('../assets/meteor_speed2.gif');
            size = 150;
        }
        else{
            bg_img = require('../assets/meteor_bg3.png');
            speed = require('../assets/meteor_speed3.gif');
            size = 200;
        }
        return(
            <View>
                <ImageBackground source={bg_img} styles={styles.backgroundImage}>
                    <View style={styles.giftContainer}>
                        <Image source={speed} 
                        styles={{width: size, 
                        heigth: size,
                        alignSelf: 'center'}}>
                        </Image>
                        <View style={styles.listContainer}>
                            <Text style={[styles.cardTitle, {marginTop: 130, marginLeft: 20}]}>
                                {item.name}
                            </Text>
                            <Text style={[styles.cardText, {marginTop: 20, marginLeft: 20}]}>
                                Mais próximo da Terra - {''} {item.close_approach_data[0].close_approach_date_full}
                            </Text>
                            <Text style={[styles.cardText, {marginTop: 5, marginLeft: 20}]}>
                                Diâmetro Mínimo (KM) - {''} 
                                {item.estimated_diameter.kilometers.estimated_diameter_min}
                            </Text>
                            <Text style={[styles.cardText, {marginTop: 5, marginLeft: 20}]}>
                                Diâmetro Máximo (KM) - {''}
                                {item.estimated_diameter.kilometers.estimated_diameter_max}
                            </Text>
                            <Text style={[styles.cardText, {marginTop: 5, marginLeft: 20}]}>
                                Velocidade (KM/H) - {''}
                                {item.close_approach_data[0].relative_velocity.kilometers_per_hour}
                            </Text>
                            <Text style={[styles.cardText, {marginTop: 5, marginLeft: 20}]}>
                            Distância da Terra - {''}
                            {item.close_approach_data[0].miss_distance.kilometers}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    } 
    keyExtractor = (item, index) => index.toString();

    render(){
        if(Object.keys(this.state.meteors).length === 0){
            return(
           <View style={{flex:1,
           justifyContent: 'center',
           alignItems: 'center'}}>
    <Text>Carregando...</Text>
           </View>
            );
        }else{
            let meteor_arr = Object.keys(this.state.meteors).map((meteor_date)=>{
              return this.state.meteors[meteor_date];
              console.log(meteors)
        })
            let meteors = [].concat.apply([], meteor_arr);

            meteors.forEach(function(element){
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min+element.estimated_diameter.kilometers.estimated_diameter_max)/2
            
            let threatScore = (diameter/ element.close_approach_data[0].kilometers)*1000000000;         
        
        element.threatScore = threatScore;
    });
    meteors.sort(function (a, b){
        return b.threat_score - a.threat_score;
    });
    meteors = meteors.slice(0,5);

    return(
        <View style={styles.container}>
            <SafeAreaView style={styles.androidSafeArea}/>
            <FlatList 
            keyExtractor={this.keyExtractor}
            data={meteors}
            renderItem={this.renderItem}
            horizontal={true}
            />
        </View>

            )
        }
    }
}

    const styles = StyleSheet.create({
        container: {
        flex: 1
        },
        androidSafeArea: {
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
        backgroundImage: {
            flex: 1,
            resizeMode: 'cover',
            width: Dimensions.get('window').width,
            heigth: Dimensions.get('window').height
        },
        listContainer:{
            backgroundColor: '#rgba(52, 52, 52, 0.5)',
            justifyContent: 'center',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 5,
            borderRadius: 12,
            padding: 10
        },
        cardTitle:{
            fontSize: 20,
            marginBottom: 10,
            fontWeight: 'bold',
            color: 'white',
        },
        cardText:{
            color: 'white'
        },
        giftContainer:{
            justifyContent: 'center',
            alignItens: 'center',
            flex: 1
        }
    })