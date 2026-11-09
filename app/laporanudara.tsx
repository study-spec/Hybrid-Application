import React, {useState} from 'react';
import { Link } from 'expo-router';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    TouchableOpacity,
} from 'react-native';

const LaporanUdaraScreen = () => {
    const[periode, setPeriode] = useState('Hari ini');

    const data = {
        lokasi: "Jakarta",
        status: "Sedang",
        pm25: 55,
        pm10: 80,
        suhu: 30,
        kelembaban: 70,
    };

    const parameter = [
        {icon: "🌫️", name: "PM2.5", nilai: "55 µg/m³"},
        {icon: "🌫️", name: "PM10", nilai: "80 µg/m³"},
        {icon: "🌡️", name: "Suhu", nilai: "30°C"},
        {icon: "💧", name: "Kelembaban", nilai: "70%"},
    ];

    const kelompok = [
        {
            icon: "👶",
            nama: "Balita dan Anak-anak",
            deskripsi: "Kelompok ini lebih rentan terhadap polusi udara karena sistem pernapasan mereka masih berkembang.",
        },

        {
            icon: "👵",
            nama: "Lansia",
            deskripsi: "Lansia memiliki risiko tinggi terhadap dampak polusi udara karena sistem imun mereka lebih lemah.",
        },

        {
            icon: "🤰",
            nama: "Ibu Hamil",
            deskripsi: "Ibu hamil memiliki kebutuhan nutrisi yang lebih tinggi dan lebih rentan terhadap dampak polusi udara.",
        },

        {
            icon: "🤧",
            nama: "Penderita Asma",
            deskripsi: "Hindari pemicu dan ikuti rencana penanganan medis.",
        },
    ];

    const tips = [
        "Gunakan masker saat berada di luar ruangan.",
        "Hindari aktivitas fisik yang berat di luar ruangan.",
        "Gunakan air purifier di dalam rumah.",
        "Tutup jendela dan pintu saat kualitas udara buruk.",
        "Perbanyak konsumsi makanan sehat dan bergizi.",
    ];

    return (
    <ScrollView
      className="flex-1 bg-[#F7F8F3]"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-5 pt-6 pb-10">

        {/* HEADER */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-[#26382E]">
            Pantauan Udara
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Pantau kondisi udara dan risiko paparan asap.
          </Text>

          <View className="mt-4 flex-row items-center">
            <Text className="text-base">📍</Text>
            <Text className="ml-2 text-sm font-medium text-gray-600">
              {data.lokasi}
            </Text>
          </View>
        </View>

        {/* KUALITAS UDARA */}
        <View className="mb-7 rounded-3xl bg-[#E5F2E8] p-5">

          <Text className="text-xs font-bold tracking-widest text-[#64836D]">
            KUALITAS UDARA SAAT INI
          </Text>

          <View className="mt-4 flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-[#287A48]">
                {data.status}
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Kondisi kualitas udara
              </Text>
            </View>

            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white">
              <Text className="text-3xl">🌿</Text>
            </View>
          </View>

          <View className="mt-5">
            <Text className="text-4xl font-bold text-[#245C3C]">
              {data.pm25}
              <Text className="text-base font-medium">
                {" "}µg/m³
              </Text>
            </Text>

            <Text className="mt-1 text-sm text-gray-500">
              Konsentrasi PM2.5
            </Text>
          </View>

          <View className="mt-4 rounded-xl bg-white/70 p-3">
            <Text className="text-sm leading-5 text-[#496352]">
              Pantau kondisi udara secara berkala,
              khususnya bagi anak-anak, lansia, dan
              kelompok rentan.
            </Text>
          </View>

        </View>

        <View className="mb-7">
          <Text className="mb-4 text-lg font-bold text-[#26382E]">
            Detail Parameter Udara
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {parameter.map((item, index) => (
              <View
                key={index}
                className="mb-3 w-[48%] rounded-2xl border border-gray-100 bg-white p-4"
              >
                <Text className="text-2xl">
                  {item.icon}
                </Text>

                <Text className="mt-3 text-sm text-gray-500">
                  {item.name}
                </Text>

                <Text className="mt-1 text-lg font-bold text-[#26382E]">
                  {item.nilai}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-7">
          <Text className="text-lg font-bold text-[#26382E]">
            Riwayat Kualitas Udara
          </Text>

          <Text className="mt-1 text-sm text-gray-500">
            Perubahan konsentrasi PM2.5 berdasarkan waktu.
          </Text>

          <View className="mt-4 flex-row rounded-xl bg-gray-100 p-1">
            {["Hari ini", "7 Hari", "30 Hari"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setPeriode(item)}
                className={`flex-1 items-center rounded-lg py-2 ${
                  periode === item
                    ? "bg-[#287A48]"
                    : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    periode === item
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-3 items-center rounded-2xl border border-dashed border-gray-300 bg-white p-8">
            <Text className="text-4xl">📊</Text>

            <Text className="mt-3 font-semibold text-[#26382E]">
              Grafik PM2.5
            </Text>

            <Text className="mt-1 text-center text-xs text-gray-400">
              Periode: {periode}
            </Text>

            <Text className="mt-2 text-center text-xs text-gray-400">
              Grafik akan ditambahkan pada tahap berikutnya.
            </Text>
          </View>
        </View>

        {/* KELOMPOK RENTAN */}
        <View className="mb-7">
          <Text className="mb-4 text-lg font-bold text-[#26382E]">
            Dampak terhadap Kelompok Rentan
          </Text>

          {kelompok.map((item, index) => (
            <View
              key={index}
              className="mb-3 flex-row items-start rounded-2xl border border-gray-100 bg-white p-4"
            >
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-[#EAF3EC]">
                <Text className="text-2xl">
                  {item.icon}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="font-bold text-[#26382E]">
                  {item.nama}
                </Text>

                <Text className="mt-1 text-sm leading-5 text-gray-500">
                  {item.deskripsi}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mb-5">
          <Text className="mb-4 text-lg font-bold text-[#26382E]">
            Tips Perlindungan
          </Text>

          <View className="rounded-2xl bg-[#EAF3EC] p-4">
            {tips.map((tip, index) => (
              <View
                key={index}
                className="mb-3 flex-row items-start"
              >
                <Text className="mr-3 font-bold text-[#287A48]">
                  ✓
                </Text>

                <Text className="flex-1 text-sm leading-5 text-[#496352]">
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-5 rounded-2xl bg-white p-4">
          <Text className="text-base font-bold text-[#26382E]">
            Butuh informasi atau bantuan lebih lanjut?
          </Text>
          <Text className="mt-1 text-sm leading-5 text-gray-500">
            Pelajari dampak polusi udara atau bicarakan gejala dengan NapasAI.
          </Text>
          <View className="mt-4 flex-row">
            <Link href="/edukasi" asChild>
              <Pressable className="mr-2 flex-1 items-center rounded-xl bg-[#EAF3EC] px-3 py-3">
                <Text className="text-center text-xs font-bold text-[#287A48]">
                  Buka Edukasi
                </Text>
              </Pressable>
            </Link>
            <Link href="/konsultasi" asChild>
              <Pressable className="ml-2 flex-1 items-center rounded-xl bg-[#287A48] px-3 py-3">
                <Text className="text-center text-xs font-bold text-white">
                  Konsultasi
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <Text className="text-center text-xs leading-5 text-gray-400">
          Informasi dan angka yang ditampilkan merupakan
          data simulasi, bukan pengukuran udara aktual.
        </Text>

      </View>
    </ScrollView>
  );
};

export default LaporanUdaraScreen;