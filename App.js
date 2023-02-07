/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import axios from 'axios';

const Tab = createBottomTabNavigator();

function App() {
  const [data, setData] = useState([]); // ini variable untuk satu surat
  const [datas, setDatas] = useState([]); // ini untuk list surat
  const [isOpen, setisopen] = useState(false); // flag untuk buka tutup surat

  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://equran.id/api/surat/', // ini diganti dari api quran tadi
    }).then(function (response) {
      setDatas(response.data); //kita masukkan response kedalam datas ini
    });
  }, []);

  const HandleSurat = () => {
    return (
      <ScrollView>
        {data?.ayat?.map((item, index) => {
          //kita masih menggunakan variable datas, sekarang ganti ke data
          return (
            <View style={styles.contentBody} key={index}>
              <Text style={styles.contentAyat}>{item.ar}</Text>
              <Text>
                {item.nomor}. {item.idn}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const getHandleAmbilPerSurat = hasilDariKlikIniYaNanti => {
    axios({
      method: 'get',
      url: `https://equran.id/api/surat/${hasilDariKlikIniYaNanti}`, // ini diganti dari api quran tadi
    }).then(function (response) {
      setData(response.data); //kita masukkan response kedalam datas ini
    });
  };

  const HandleListSurat = () => {
    return (
      <ScrollView>
        {datas?.map((item, index) => {
          //struktur beda dengan data per satuan
          return (
            <View style={styles.contentBody} key={index}>
              <TouchableOpacity
                onPress={() => {
                  setisopen(true);
                  getHandleAmbilPerSurat(item.nomor); //jadi wktu klik, hasilnya sesuai nomor
                }}>
                <Text style={styles.contentAyat}>{item.nama}</Text>
                <Text>
                  {item.nomor}. {item.nama_latin}
                </Text>
                <Text>
                  surat turun di: {item.tempat_turun}, jumlah ayat:{' '}
                  {item.jumlah_ayat}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const HandleJus = () => {
    return (
      <ScrollView>
        <View style={styles.contentBody}>
          <Text>Coming Soon!</Text>
        </View>
      </ScrollView>
    );
  };

  console.log('datass', datas);
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name={
            isOpen
              ? `Surat ${data?.nama_latin}` //ini ganti ke data
              : 'Full Kumpulan Surat Al-Quran'
          }
          component={isOpen ? HandleSurat : HandleListSurat}
          //setelah itu kita psang untuk back nya
          listeners={{
            tabPress: e => {
              setisopen(false);
            },
          }}
        />
        <Tab.Screen name="Jus" component={HandleJus} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  contentBody: {
    margin: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  contentAyat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default App;
