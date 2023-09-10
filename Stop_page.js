import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import react, { useEffect, useState } from "react";
import axios from "axios";
import converter from 'xml-js';
import * as Speech from 'expo-speech'

export default function Stop_page({route}){


  const BUSSTOP_ID = parseInt(route.params[Object.keys(route.params)[0]]);
  const api_url = 'http://api.gwangju.go.kr/xml/arriveInfo';
  const serviceKey = "qBLyHIv4CIm4knTDgeP%2F0OwIMc1Zd8H08eAJLLmMpXXnmE39g11IW1ukP%2F17Tqa1vV6Nq2X6vmhxKjLDq6q2fw%3D%3D";
  const fullUrl = `${api_url}?serviceKey=${serviceKey}&BUSSTOP_ID=${BUSSTOP_ID}`;

  const [pres_data,Set_pres_data] = useState({});
  const [pressedIndex, setPressedIndex] = useState([]);// 각각의 키들을 저장하는 배열. 이곳에 키가 존재하고 핸들함수가 호출되면 그 키값 제거. 없다면 추가

  const call_buses = async () => {
    try {
      const response = await axios.get(fullUrl);
      console.log(typeof response.data);
  
      const datas = JSON.parse(converter.xml2json(response.data, {
        compact: true,
        spaces: 4,
      }));
  
      const refined_data = datas["ns2:ARRIVE_INFO"]["ARRIVE_LIST"]["ARRIVE"];
  
      Set_pres_data(prevData => {
        let new_data = {};
        for (var i = 0; i < refined_data.length; i++) {
          new_data = {
            ...new_data,
            [i]: {
              "bus_name": refined_data[i]["LINE_NAME"]["_text"],
              "current_stop": refined_data[i]["BUSSTOP_NAME"]["_text"],
              "remain_min": refined_data[i]["REMAIN_MIN"]["_text"],
              "remain_stops": refined_data[i]["REMAIN_STOP"]["_text"],
              "ON": (prevData[i]?.remain_stops !== refined_data[i]["REMAIN_STOP"]["_text"]) ? 1 : 0,
              //"pressed": ,
            }
          };
  
          console.log(
            new_data[i]["bus_name"],
            prevData[i]?.remain_min,
            new_data[i]["remain_min"],
            new_data[i]["ON"]
          );
          console.log("------");
        }
        return new_data;
      });
  
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    call_buses();

    const timerId = setInterval(() => {
      call_buses();
    }, 10000);

    return () => {
      clearInterval(timerId);
    }
  }, []);
  
  // useEffect(() => {
  //   // pres_data가 업데이트될 때마다 실행되는 콜백 함수
  // }, [pres_data]);

  const handleLongPress = (key) => {

    if(pressedIndex.includes(key))
    {
      pressedIndex[pressedIndex.indexOf(key)] = 0;
      setPressedIndex([...pressedIndex])
    }
    else{setPressedIndex(key);}
    }
  
    const speak = (get_text)=>{
      Speech.speak(get_text);
    }
    return (
     
      <ScrollView>
        {Object.keys(pres_data).map(key => 
        <View key={key} style={pressedIndex.includes(key)? 
        stop_styles.bus_tab_pressed : stop_styles.bus_tab}>

        <Pressable
        delayLongPress={50}
        onLongPress={() => {handleLongPress(key)}}//수정할곳. 키값 존재한다면 제거.없다면 추가
         
       >
        <View>
          <Text>{pres_data[key]["bus_name"]}</Text>
          <Text>{`${pres_data[key]["remain_min"]}분 남았습니다.`}</Text>
          </View>

         
        </Pressable>
        <View>
          
            {(pres_data[key]["ON"]&&pressedIndex.includes(key))? speak(`${pres_data[key]["remain_min"]}분 남았습니다.`):""}
          
          </View>
       
      
          </View>
          )}
      </ScrollView>

    )
}

const stop_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 15,
  },

  bus_tab: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
    justifyContent: 'space-between',
  },

  bus_tab_pressed: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#ffc0cb",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
    justifyContent: 'space-between',
  }
})