
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
} from "react-native";

type Category =
  | "Semua"
  | "ISPA"
  | "Karhutla"
  | "Obat-obatan"
  | "Kesehatan Mata";

type FactStatus =
  | "Didukung Bukti"
  | "Belum Cukup Bukti"
  | "Menyesatkan"
  | "Hoax";

type Article = {
  id: number;
  title: string;
  description: string;
  category: Category;
  image: string;
  readTime: string;
  content: string[];
  source: string;
};

type Fact = {
  id: number;
  title: string;
  category: Category;
  status: FactStatus;
  date: string;
  summary: string;
  explanation: string;
  impact: string[];
  solution: string[];
  source: string[];
  doctor: string;
};

const categories: Category[] = [
  "Semua",
  "ISPA",
  "Karhutla",
  "Obat-obatan",
  "Kesehatan Mata",
];

const articles: Article[] = [
  {
    id: 1,
    title: "Bahaya Asap Karhutla bagi Kesehatan Pernapasan",
    description:
      "Kenali dampak paparan asap kebakaran hutan terhadap paru-paru dan saluran pernapasan.",
    category: "Karhutla",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=900",
    readTime: "5 menit",
    content: [
      "Asap kebakaran hutan mengandung campuran gas dan partikel halus yang dapat masuk ke saluran pernapasan.",
      "Paparan asap dapat menyebabkan iritasi tenggorokan, batuk, sesak, serta memperburuk kondisi seperti asma dan penyakit paru lainnya.",
      "Partikel halus PM2.5 dapat masuk jauh ke dalam paru-paru. Risiko dampak kesehatan bergantung pada konsentrasi asap, durasi paparan, dan kondisi individu.",
    ],
    source: "WHO, informasi kualitas udara dan kesehatan.",
  },
  {
    id: 2,
    title: "Mengenal ISPA dan Gejala yang Perlu Diwaspadai",
    description:
      "Pelajari gejala infeksi saluran pernapasan akut dan kapan harus mencari pertolongan medis.",
    category: "ISPA",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=900",
    readTime: "4 menit",
    content: [
      "ISPA adalah kelompok infeksi yang menyerang saluran pernapasan. Penyebabnya dapat berupa virus maupun bakteri tertentu.",
      "Gejala yang dapat muncul antara lain batuk, pilek, sakit tenggorokan, demam, dan pada kondisi tertentu sesak napas.",
      "Paparan asap bukan berarti seseorang pasti terkena ISPA. Namun, asap dapat mengiritasi saluran pernapasan dan memperburuk penyakit pernapasan yang sudah ada.",
    ],
    source: "Kementerian Kesehatan RI dan WHO.",
  },
  {
    id: 3,
    title: "Penggunaan Obat yang Tepat untuk Gangguan Pernapasan",
    description:
      "Kenali perbedaan obat pereda gejala, antibiotik, dan pentingnya konsultasi medis.",
    category: "Obat-obatan",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900",
    readTime: "6 menit",
    content: [
      "Tidak semua gangguan pernapasan membutuhkan antibiotik. Jenis pengobatan bergantung pada penyebab dan hasil pemeriksaan.",
      "Antibiotik digunakan untuk infeksi bakteri tertentu, bukan untuk mengatasi infeksi virus atau iritasi akibat asap.",
      "Hindari menggunakan obat resep milik orang lain atau mengonsumsi antibiotik tanpa petunjuk tenaga medis.",
    ],
    source: "WHO, informasi penggunaan antibiotik yang bijak.",
  },
  {
    id: 4,
    title: "Mata Merah dan Iritasi Akibat Paparan Asap",
    description:
      "Mengapa asap dapat membuat mata terasa perih, gatal, dan berair?",
    category: "Kesehatan Mata",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900",
    readTime: "3 menit",
    content: [
      "Partikel dan zat iritan dalam asap dapat mengganggu permukaan mata sehingga menimbulkan rasa perih, gatal, merah, dan berair.",
      "Hindari mengucek mata karena dapat memperburuk iritasi. Jika menggunakan lensa kontak, lepaskan sementara ketika mata terasa terganggu.",
      "Segera periksakan diri jika mengalami nyeri berat, gangguan penglihatan, atau pembengkakan yang signifikan.",
    ],
    source: "Informasi kesehatan mata dan paparan polutan udara.",
  },
];

const facts: Fact[] = [
  {
    id: 1,
    title:
      "Masker kain sudah cukup untuk melindungi diri dari semua partikel asap karhutla.",
    category: "Karhutla",
    status: "Menyesatkan",
    date: "Contoh pemeriksaan",
    summary:
      "Masker kain biasa tidak dirancang untuk menyaring partikel halus secara andal.",
    explanation:
      "Masker respirator seperti N95 yang terpasang dengan rapat dapat membantu menyaring partikel halus di udara. Namun, masker tersebut tidak melindungi dari semua gas dan zat kimia dalam asap.",
    impact: [
      "Partikel halus dapat masuk ke saluran pernapasan.",
      "Paparan asap dapat memperburuk asma dan penyakit paru.",
      "Perlindungan masker bergantung pada jenis dan kerapatan pemakaian.",
    ],
    solution: [
      "Kurangi aktivitas di luar ruangan ketika kualitas udara buruk.",
      "Gunakan respirator N95 yang pas jika harus berada di area berasap.",
      "Cari ruangan dengan udara yang lebih bersih.",
    ],
    source: [
      "US EPA – Wildfire Smoke and Your Health",
      "CDC – Wildfire Smoke",
    ],
    doctor:
      "Perlindungan pernapasan tidak cukup hanya dengan memakai masker apa pun. Jenis masker dan cara pemakaian sangat penting. Jika mengalami batuk atau sesak setelah terpapar asap, lakukan pemeriksaan medis.",
  },
  {
    id: 2,
    title:
      "Mengonsumsi antibiotik dapat menyembuhkan iritasi pernapasan akibat asap.",
    category: "Obat-obatan",
    status: "Menyesatkan",
    date: "Contoh pemeriksaan",
    summary:
      "Antibiotik tidak digunakan untuk mengatasi iritasi akibat paparan asap.",
    explanation:
      "Antibiotik bekerja melawan bakteri tertentu. Iritasi saluran pernapasan akibat asap bukanlah infeksi bakteri. Penggunaan antibiotik tanpa indikasi juga berisiko menyebabkan efek samping dan resistansi antibiotik.",
    impact: [
      "Penggunaan yang tidak tepat dapat menyebabkan efek samping.",
      "Dapat meningkatkan risiko resistansi antibiotik.",
      "Penanganan yang tidak sesuai dapat menunda pemeriksaan penyebab gejala.",
    ],
    solution: [
      "Jangan mengonsumsi antibiotik tanpa resep atau indikasi medis.",
      "Hindari paparan asap dan cari udara yang lebih bersih.",
      "Konsultasikan gejala yang menetap atau semakin berat kepada dokter.",
    ],
    source: [
      "WHO – Antimicrobial Resistance",
      "Kementerian Kesehatan RI – Penggunaan Antibiotik",
    ],
    doctor:
      "Tidak semua batuk dan gangguan pernapasan membutuhkan antibiotik. Dokter perlu menentukan penyebab keluhan sebelum memberikan terapi yang sesuai.",
  },
  {
    id: 3,
    title:
      "Paparan asap kebakaran dapat menyebabkan mata terasa perih dan berair.",
    category: "Kesehatan Mata",
    status: "Didukung Bukti",
    date: "Contoh pemeriksaan",
    summary:
      "Asap mengandung zat iritan yang dapat mengganggu permukaan mata.",
    explanation:
      "Paparan asap dan partikel polutan dapat menimbulkan iritasi mata. Gejala yang mungkin muncul antara lain mata merah, terasa perih, gatal, dan berair.",
    impact: [
      "Mata terasa kering atau perih.",
      "Mata menjadi merah dan berair.",
      "Iritasi dapat bertambah jika mata terus digosok.",
    ],
    solution: [
      "Hindari area yang terpapar asap.",
      "Jangan mengucek mata.",
      "Bilas dengan air bersih atau larutan saline steril jika diperlukan.",
      "Cari pertolongan medis jika nyeri berat atau penglihatan terganggu.",
    ],
    source: [
      "US EPA – Wildfire Smoke and Your Health",
      "Informasi kesehatan mata terkait polusi udara",
    ],
    doctor:
      "Jika mata terasa perih akibat asap, langkah awal adalah menjauh dari sumber paparan dan tidak mengucek mata. Apabila muncul nyeri berat, gangguan penglihatan, atau bengkak signifikan, segera periksakan diri.",
  },
  {
    id: 4,
    title:
      "Semua orang yang menghirup asap kebakaran pasti mengalami ISPA.",
    category: "ISPA",
    status: "Hoax",
    date: "Contoh pemeriksaan",
    summary:
      "Paparan asap tidak otomatis menyebabkan infeksi saluran pernapasan.",
    explanation:
      "ISPA merupakan infeksi yang umumnya disebabkan oleh virus atau bakteri tertentu. Asap dapat menyebabkan iritasi dan memperburuk gangguan pernapasan, tetapi tidak berarti setiap orang yang menghirupnya pasti mengalami ISPA.",
    impact: [
      "Paparan asap dapat memicu batuk dan iritasi.",
      "Penderita asma dapat mengalami gejala yang memburuk.",
      "Risiko dampak kesehatan berbeda pada setiap orang.",
    ],
    solution: [
      "Kurangi paparan asap.",
      "Pantau gejala pernapasan.",
      "Periksakan diri jika keluhan menetap atau memburuk.",
    ],
    source: [
      "WHO – Air Pollution and Health",
      "CDC – Respiratory Infections",
    ],
    doctor:
      "Paparan asap dan ISPA adalah dua hal yang berbeda. Asap dapat mengiritasi saluran pernapasan, sedangkan ISPA merupakan infeksi. Pemeriksaan dibutuhkan untuk mengetahui penyebab keluhan.",
  },
];

const statusStyle = (status: FactStatus) => {
  switch (status) {
    case "Didukung Bukti":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      };
    case "Belum Cukup Bukti":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        dot: "bg-amber-500",
      };
    case "Menyesatkan":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        dot: "bg-orange-500",
      };
    default:
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        dot: "bg-red-500",
      };
  }
};

export default function EdukasiScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("Semua");

  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const [selectedFact, setSelectedFact] =
    useState<Fact | null>(null);

  const [showDoctor, setShowDoctor] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const filteredArticles =
    selectedCategory === "Semua"
      ? articles
      : articles.filter(
          (item) => item.category === selectedCategory
        );

  const filteredFacts =
    selectedCategory === "Semua"
      ? facts
      : facts.filter(
          (item) => item.category === selectedCategory
        );

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
    setSelectedFact(null);
    setShowDoctor(false);
    setShowSolution(false);
  };

  const openFact = (fact: Fact) => {
    setSelectedFact(fact);
    setSelectedArticle(null);
    setShowDoctor(false);
    setShowSolution(false);
  };

  const goBack = () => {
    setSelectedArticle(null);
    setSelectedFact(null);
    setShowDoctor(false);
    setShowSolution(false);
  };

  const resetCategory = () => {
    setSelectedCategory("Semua");
  };

  const CategoryChip = ({
    item,
  }: {
    item: Category;
  }) => {
    const active = selectedCategory === item;

    return (
      <Pressable
        onPress={() => setSelectedCategory(item)}
        className={`px-4 py-2.5 rounded-full mr-2 border ${
          active
            ? "bg-emerald-600 border-emerald-600"
            : "bg-white border-gray-200"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            active ? "text-white" : "text-gray-600"
          }`}
        >
          {item}
        </Text>
      </Pressable>
    );
  };

  const StatusBadge = ({
    status,
  }: {
    status: FactStatus;
  }) => {
    const style = statusStyle(status);

    return (
      <View
        className={`${style.bg} self-start px-3 py-1.5 rounded-full flex-row items-center`}
      >
        <View
          className={`w-2 h-2 rounded-full mr-2 ${style.dot}`}
        />
        <Text className={`${style.text} text-xs font-bold`}>
          {status}
        </Text>
      </View>
    );
  };

  // =========================
  // DETAIL FACT OR HOAX
  // =========================

  if (selectedFact) {
    const style = statusStyle(selectedFact.status);

    return (
      <View className="flex-1 bg-[#F6F9F7]">
        <StatusBar barStyle="dark-content" backgroundColor="#F6F9F7" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="px-5 pt-12 pb-10">
            <Pressable
              onPress={goBack}
              className="flex-row items-center mb-6"
            >
              <Text className="text-emerald-700 text-base font-bold">
                ← Kembali ke Edukasi
              </Text>
            </Pressable>

            <Text className="text-emerald-700 text-xs font-bold tracking-widest mb-2">
              FACT CHECKING
            </Text>

            <Text className="text-gray-900 text-2xl font-extrabold leading-9 mb-4">
              Pemeriksaan Informasi
            </Text>

            <View className="bg-white p-5 rounded-3xl border border-gray-100 mb-4">
              <Text className="text-gray-400 text-xs font-semibold mb-3">
                KLAIM YANG DIPERIKSA
              </Text>

              <Text className="text-gray-900 text-lg font-bold leading-7 mb-4">
                "{selectedFact.title}"
              </Text>

              <View className="flex-row items-center justify-between flex-wrap gap-2">
                <StatusBadge status={selectedFact.status} />
                <Text className="text-gray-400 text-xs">
                  {selectedFact.date}
                </Text>
              </View>
            </View>

            <View className="bg-white rounded-3xl p-5 mb-4 border border-gray-100">
              <Text className="text-gray-900 font-bold text-base mb-2">
                Hasil Pemeriksaan
              </Text>
              <Text className="text-gray-600 text-sm leading-6">
                {selectedFact.summary}
              </Text>

              <View className="h-px bg-gray-100 my-4" />

              <Text className="text-gray-900 font-bold text-base mb-2">
                Mengapa demikian?
              </Text>
              <Text className="text-gray-600 text-sm leading-6">
                {selectedFact.explanation}
              </Text>
            </View>

            <View className="bg-white rounded-3xl p-5 mb-4 border border-gray-100">
              <Text className="text-gray-900 font-bold text-base mb-4">
                Dampak bagi Kesehatan
              </Text>

              {selectedFact.impact.map((item, index) => (
                <View key={index} className="flex-row mb-3">
                  <View className="w-7 h-7 bg-orange-50 rounded-full items-center justify-center mr-3">
                    <Text className="text-orange-600 font-bold text-xs">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-sm leading-6 flex-1">
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            {/* SOLUSI INTERAKTIF */}
            <Pressable
              onPress={() => setShowSolution(!showSolution)}
              className="bg-emerald-600 rounded-2xl p-5 mb-3"
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">🩺</Text>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      Solusi dan Pencegahan
                    </Text>
                    <Text className="text-emerald-100 text-xs mt-1">
                      Langkah yang dapat dilakukan
                    </Text>
                  </View>
                </View>
                <Text className="text-white text-xl">
                  {showSolution ? "−" : "+"}
                </Text>
              </View>

              {showSolution && (
                <View className="mt-5 pt-4 border-t border-emerald-400">
                  {selectedFact.solution.map((item, index) => (
                    <View key={index} className="flex-row mb-3">
                      <Text className="text-white mr-2">✓</Text>
                      <Text className="text-white text-sm leading-6 flex-1">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>

            {/* DOKTER INTERAKTIF */}
            <Pressable
              onPress={() => setShowDoctor(!showDoctor)}
              className="bg-white rounded-2xl p-5 mb-4 border border-emerald-100"
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center mr-3">
                  <Text className="text-2xl">👨‍⚕️</Text>
                </View>

                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-base">
                    Penjelasan Medis
                  </Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    Informasi dan arahan kesehatan
                  </Text>
                </View>

                <Text className="text-emerald-600 text-xl">
                  {showDoctor ? "−" : "+"}
                </Text>
              </View>

              {showDoctor && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <Text className="text-gray-600 text-sm leading-7">
                    {selectedFact.doctor}
                  </Text>

                  <View className="bg-amber-50 p-3 rounded-xl mt-4">
                    <Text className="text-amber-800 text-xs leading-5">
                      Catatan: Ini merupakan contoh konten edukasi
                      simulasi, bukan diagnosis atau pernyataan
                      dokter sungguhan.
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>

            <View className="bg-white rounded-3xl p-5 border border-gray-100">
              <Text className="text-gray-900 font-bold text-base mb-3">
                Referensi Pemeriksaan
              </Text>

              {selectedFact.source.map((item, index) => (
                <View key={index} className="flex-row mb-2">
                  <Text className="text-emerald-600 mr-2">•</Text>
                  <Text className="text-gray-600 text-sm flex-1">
                    {item}
                  </Text>
                </View>
              ))}

              <Text className="text-gray-400 text-xs mt-3 leading-5">
                Referensi di atas merupakan contoh sumber yang
                perlu diverifikasi dan dilengkapi dengan tautan
                penelitian saat implementasi nyata.
              </Text>
            </View>

            <View className="mt-5 p-4 bg-blue-50 rounded-2xl">
              <Text className="text-blue-800 text-xs leading-5">
                Informasi ini bertujuan untuk edukasi. Status
                validasi bukan pengganti konsultasi medis.
                Diagnosis dan pengobatan harus disesuaikan
                dengan kondisi masing-masing pasien.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // =========================
  // DETAIL ARTIKEL
  // =========================

  if (selectedArticle) {
    return (
      <View className="flex-1 bg-[#F6F9F7]">
        <StatusBar barStyle="dark-content" backgroundColor="#F6F9F7" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: selectedArticle.image }}
            className="w-full h-64"
            resizeMode="cover"
          />

          <View className="px-5 pt-5 pb-10">
            <Pressable
              onPress={goBack}
              className="mb-5"
            >
              <Text className="text-emerald-700 font-bold">
                ← Kembali ke Edukasi
              </Text>
            </Pressable>

            <View className="flex-row items-center mb-3">
              <View className="bg-emerald-50 rounded-full px-3 py-1.5">
                <Text className="text-emerald-700 text-xs font-bold">
                  {selectedArticle.category}
                </Text>
              </View>

              <Text className="text-gray-400 text-xs ml-3">
                {selectedArticle.readTime} membaca
              </Text>
            </View>

            <Text className="text-gray-900 text-2xl font-extrabold leading-9 mb-3">
              {selectedArticle.title}
            </Text>

            <Text className="text-gray-500 text-sm leading-6 mb-6">
              {selectedArticle.description}
            </Text>

            <View className="bg-white p-5 rounded-3xl border border-gray-100">
              <Text className="text-gray-900 font-bold text-lg mb-4">
                Ringkasan Artikel
              </Text>

              {selectedArticle.content.map((paragraph, index) => (
                <Text
                  key={index}
                  className="text-gray-600 text-sm leading-7 mb-4"
                >
                  {paragraph}
                </Text>
              ))}
            </View>

            <View className="bg-white rounded-2xl p-5 mt-4 border border-gray-100">
              <Text className="text-gray-900 font-bold mb-2">
                Sumber Informasi
              </Text>
              <Text className="text-gray-500 text-sm leading-6">
                {selectedArticle.source}
              </Text>
            </View>

            <View className="bg-emerald-50 p-4 rounded-2xl mt-4">
              <Text className="text-emerald-800 text-sm font-semibold mb-1">
                Ingin memeriksa kebenaran informasi?
              </Text>
              <Text className="text-emerald-700 text-xs leading-5">
                Gunakan fitur Fact or Hoax untuk melihat
                pemeriksaan klaim kesehatan berdasarkan bukti.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // =========================
  // HALAMAN UTAMA EDUKASI
  // =========================

  return (
    <View className="flex-1 bg-[#F6F9F7]">
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F7" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* HEADER */}
        <View className="bg-[#E8F6EF] px-5 pt-14 pb-7 rounded-b-[32px]">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-emerald-800 text-xs font-bold tracking-widest">
                NAPASAI
              </Text>
              <Text className="text-gray-900 text-2xl font-extrabold mt-1">
                Pusat Edukasi
              </Text>
            </View>

            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center">
              <Text className="text-2xl">📚</Text>
            </View>
          </View>

          <Text className="text-gray-700 text-sm leading-6">
            Tingkatkan pengetahuan kesehatanmu. Temukan
            informasi terpercaya dan kenali fakta di balik
            berbagai informasi kesehatan.
          </Text>

          <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center mt-5">
            <Text className="text-lg mr-3">🔎</Text>
            <Text className="text-gray-400 text-sm flex-1">
              Cari artikel atau informasi kesehatan
            </Text>
          </View>
        </View>

        {/* FACT OR HOAX HERO */}
        <View className="px-5 mt-6">
          <View className="bg-[#087E68] rounded-3xl p-5 overflow-hidden">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <View className="bg-white/20 self-start rounded-full px-3 py-1 mb-3">
                  <Text className="text-white text-[10px] font-bold tracking-wider">
                    FITUR UNGGULAN
                  </Text>
                </View>

                <Text className="text-white text-2xl font-extrabold leading-8">
                  Fact or Hoax
                </Text>

                <Text className="text-emerald-50 text-xs leading-5 mt-2">
                  Jangan mudah percaya! Periksa kebenaran
                  informasi kesehatan berdasarkan bukti ilmiah.
                </Text>
              </View>

              <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center">
                <Text className="text-4xl">🔍</Text>
              </View>
            </View>

            <View className="flex-row mt-5">
              <View className="flex-1 bg-white/15 rounded-xl p-3 mr-2">
                <Text className="text-white text-lg font-extrabold">
                  {facts.length}
                </Text>
                <Text className="text-emerald-50 text-[10px]">
                  Contoh pemeriksaan
                </Text>
              </View>

              <View className="flex-1 bg-white/15 rounded-xl p-3">
                <Text className="text-white text-lg font-extrabold">
                  4
                </Text>
                <Text className="text-emerald-50 text-[10px]">
                  Status informasi
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => openFact(facts[0])}
              className="bg-white rounded-xl py-3 mt-4 items-center"
            >
              <Text className="text-emerald-800 font-bold text-sm">
                Periksa Informasi Sekarang →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* STATUS LEGEND */}
        <View className="px-5 mt-7">
          <Text className="text-gray-900 text-base font-extrabold mb-3">
            Indikator Validasi
          </Text>

          <View className="flex-row flex-wrap gap-2">
            <View className="bg-emerald-50 px-3 py-2 rounded-full">
              <Text className="text-emerald-700 text-[10px] font-bold">
                ● Didukung Bukti
              </Text>
            </View>

            <View className="bg-amber-50 px-3 py-2 rounded-full">
              <Text className="text-amber-700 text-[10px] font-bold">
                ● Belum Cukup Bukti
              </Text>
            </View>

            <View className="bg-orange-50 px-3 py-2 rounded-full">
              <Text className="text-orange-700 text-[10px] font-bold">
                ● Menyesatkan
              </Text>
            </View>

            <View className="bg-red-50 px-3 py-2 rounded-full">
              <Text className="text-red-700 text-[10px] font-bold">
                ● Hoax
              </Text>
            </View>
          </View>
        </View>

        {/* CATEGORY */}
        <View className="mt-7">
          <View className="px-5 mb-3">
            <Text className="text-gray-900 text-base font-extrabold">
              Kategori Edukasi
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              Pilih topik yang ingin kamu pelajari
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {categories.map((item) => (
              <CategoryChip key={item} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* FACT CHECK LIST */}
        <View className="px-5 mt-7">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-900 text-lg font-extrabold">
                Pemeriksaan Fakta
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Kenali informasi yang beredar
              </Text>
            </View>

            <View className="bg-emerald-50 rounded-full px-3 py-1.5">
              <Text className="text-emerald-700 text-xs font-bold">
                {filteredFacts.length} Informasi
              </Text>
            </View>
          </View>

          {filteredFacts.length === 0 ? (
            <View className="bg-white p-6 rounded-2xl items-center">
              <Text className="text-3xl mb-2">🔎</Text>
              <Text className="text-gray-500 text-sm">
                Belum ada informasi pada kategori ini.
              </Text>
            </View>
          ) : (
            filteredFacts.map((fact) => (
              <Pressable
                key={fact.id}
                onPress={() => openFact(fact)}
                className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-emerald-700 text-xs font-bold">
                    {fact.category}
                  </Text>
                  <Text className="text-gray-400 text-[10px]">
                    {fact.date}
                  </Text>
                </View>

                <Text className="text-gray-900 text-sm font-bold leading-6 mb-3">
                  {fact.title}
                </Text>

                <Text className="text-gray-500 text-xs leading-5 mb-4">
                  {fact.summary}
                </Text>

                <View className="flex-row justify-between items-center">
                  <StatusBadge status={fact.status} />

                  <Text className="text-emerald-700 text-xs font-bold">
                    Lihat Analisis →
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* ARTICLE SECTION */}
        <View className="px-5 mt-7">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-900 text-lg font-extrabold">
                Artikel Kesehatan
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Informasi dan wawasan untuk kesehatanmu
              </Text>
            </View>

            <Text className="text-emerald-700 text-xs font-bold">
              {filteredArticles.length} Artikel
            </Text>
          </View>

          {filteredArticles.length === 0 ? (
            <View className="bg-white p-6 rounded-2xl items-center">
              <Text className="text-3xl mb-2">📖</Text>
              <Text className="text-gray-500 text-sm">
                Belum ada artikel pada kategori ini.
              </Text>
            </View>
          ) : (
            filteredArticles.map((article) => (
              <Pressable
                key={article.id}
                onPress={() => openArticle(article)}
                className="bg-white rounded-2xl overflow-hidden mb-4 border border-gray-100"
              >
                <Image
                  source={{ uri: article.image }}
                  className="w-full h-44"
                  resizeMode="cover"
                />

                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-emerald-700 text-xs font-bold">
                      {article.category}
                    </Text>

                    <Text className="text-gray-400 text-[10px]">
                      {article.readTime} membaca
                    </Text>
                  </View>

                  <Text className="text-gray-900 font-bold text-base leading-6 mb-2">
                    {article.title}
                  </Text>

                  <Text className="text-gray-500 text-xs leading-5">
                    {article.description}
                  </Text>

                  <View className="flex-row justify-end mt-4">
                    <Text className="text-emerald-700 text-xs font-bold">
                      Baca Selengkapnya →
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* DOCTOR INFORMATION */}
        <View className="px-5 mt-4">
          <View className="bg-[#E8F6EF] rounded-3xl p-5">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center mr-3">
                <Text className="text-2xl">👩‍⚕️</Text>
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-base">
                  Butuh Penjelasan Medis?
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  Jangan ragu untuk berkonsultasi.
                </Text>
              </View>
            </View>

            <Text className="text-gray-600 text-xs leading-5 mb-4">
              Informasi edukasi membantu kamu memahami
              kesehatan. Dokter dapat membantu mengevaluasi
              gejala dan menentukan penanganan sesuai kondisi.
            </Text>

            <View className="bg-emerald-600 rounded-xl py-3 items-center">
              <Text className="text-white font-bold text-sm">
                Konsultasi dengan Dokter
              </Text>
              <Text className="text-emerald-100 text-[10px] mt-1">
                Lanjutkan melalui menu Konsultasi
              </Text>
            </View>
          </View>
        </View>

        {/* DISCLAIMER */}
        <View className="px-5 mt-6">
          <Text className="text-gray-400 text-[10px] leading-5 text-center">
            Konten Edukasi NapasAI merupakan informasi
            kesehatan umum dan bukan pengganti diagnosis
            atau pengobatan dari tenaga medis profesional.
            Periksa sumber dan tanggal pembaruan setiap
            informasi sebelum mengambil keputusan kesehatan.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
