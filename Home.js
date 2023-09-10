import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { bus_stops } from './busstop_data copy';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';
import { useNavigation } from '@react-navigation/native';
import Stop_page from './Stop_page';



const STORAGE_KEY = "@added_stops";


export default function Home({navigation}) {

    //const navigation = useNavigation();
    //useEffect(()=>console.log(added_stops),[]);
    const [text,setText] = useState("");
    const [BUSSTOP_ID,setBusstop_id] = useState("");
    const [added_stops,Set_added_stops] = useState({});
    const settingBusstop_id = (id) => setBusstop_id(id);
    const onChangeText = (text) => setText(text);
    const setting_added_stops = (added_stops) => Set_added_stops(added_stops);
    const SaveStops = async (toSave) =>{ //저장
      await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));
    }
    const loadStops = async()=> {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      console.log(s);
      setBusstop_id(JSON.parse(s)); //맞는코드인지 확인 필요
    }
    const adding_bus_stops = async()=>{ // 스크롤뷰에 추가,유저가 검색한 정류장 저장하기위한 작업
      console.log("입력값: ",text);
     // console.log("입력값");
      if(text === "")
        return;
      if(text in bus_stops && !(text in Object.keys(added_stops))){
        const new_stops = {...added_stops, [text] : bus_stops[text], };
        // const new_stops = Object.assign(
        //   {},
        //   added_stops,
        //   {[text] : bus_stops[text]},); 같은결과를 가지는 Objec.assign함수
      
  
          await SaveStops(new_stops);
          setting_added_stops(new_stops);
          
          setText("");
          console.log(new_stops);
          console.log("new_stops: ",new_stops,"added_stops: ",added_stops);
      }
      else if(!(text in bus_stops)){
        console.log("잘못된 정류장이름");
        setText("");
      }
     else{
      setText("");
     }
    }
  
    return (
      <View style={styles.container}>
        <StatusBar style="auto"/>
        {/* <View >
          <Text style={styles.header}>늦지마라늦지마라규</Text>
        </View> */}

        <TextInput
        returnKeyType='done'
        onSubmitEditing={adding_bus_stops}
        onChangeText={onChangeText}
        value={text}
        placeholder="버스정류장 이름을 입력하세요."
        style={styles.input}
        />

        <ScrollView>
          
            {Object.keys(added_stops).map((key)=> 
            <View>
              <Pressable onPress={()=>{ navigation.push('Stop_page',{[key]:added_stops[key]} );}}>
              <Text style={styles.sv}>
                {key}
                </Text>
              </Pressable>
              
            </View>)}
          
  
        </ScrollView>
        
      </View>
   
    )}
  
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#CDDEEE",
        paddingHorizontal: 20,
      },
      header: {
        marginTop: 100,
        color: "white",
        fontSize: 20,
      },
      input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius:10,
        marginVertical: 20,
        fontSize: 18,
      },
      sv: {
        backgroundColor: "#8AFF8A",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius:30,
        marginVertical: 20,
        fontSize: 18,
      }
    })
  