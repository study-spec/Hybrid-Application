
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Stage = "symptom" | "duration" | "exposure" | "done" | "urgent";

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

type Doctor = {
  id: number;
  name: string;
  specialist: string;
  description: string;
  schedule: string;
  initial: string;
};

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Andi Pratama",
    specialist: "Dokter Umum",
    description: "Evaluasi awal keluhan pernapasan",
    schedule: "Jadwal contoh: Senin–Jumat",
    initial: "AP",
  },
  {
    id: 2,
    name: "Dr. Siti Rahma, Sp.P",
    specialist: "Spesialis Paru",
    description: "Evaluasi gangguan sistem pernapasan",
    schedule: "Jadwal contoh: Selasa–Sabtu",
    initial: "SR",
  },
  {
    id: 3,
    name: "Dr. Budi Santoso, Sp.A",
    specialist: "Spesialis Anak",
    description: "Pelayanan kesehatan pernapasan anak",
    schedule: "Jadwal contoh: Senin–Kamis",
    initial: "BS",
  },
];

export default function KonsultasiScreen() {
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<Stage>("symptom");

  const [symptom, setSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [exposure, setExposure] = useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Halo! 👋 Saya NapasAI, asisten kesehatan pernapasan kamu.",
    },
    {
      id: 2,
      sender: "bot",
      text: "Saya akan membantu mengumpulkan informasi mengenai keluhan pernapasanmu, termasuk kemungkinan paparan asap karhutla.",
    },
    {
      id: 3,
      sender: "bot",
      text: "Apa keluhan yang sedang kamu rasakan saat ini?",
    },
  ]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        sender: "bot",
        text,
      },
    ]);
  };

  // Mengidentifikasi tanda bahaya dari jawaban pengguna
  const hasDangerSign = (text: string) => {
    const lower = text.toLowerCase();

    const dangerWords = [
      "sesak berat",
      "sulit bernapas",
      "susah bernapas",
      "tidak bisa bernapas",
      "bibir biru",
      "sulit bicara karena sesak",
      "pingsan",
    ];

    return dangerWords.some((word) => lower.includes(word));
  };

  const sendMessage = (value?: string) => {
    const text = (value ?? input).trim();

    if (!text || stage === "done" || stage === "urgent") {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text,
      },
    ]);

    setInput("");

    // Penanganan kondisi darurat
    if (hasDangerSign(text)) {
      setStage("urgent");

      addBotMessage(
        "⚠️ Keluhan yang kamu sampaikan dapat menunjukkan kondisi serius. Segera cari pertolongan medis di IGD atau hubungi layanan darurat setempat. Jangan menunggu proses chatbot selesai."
      );

      return;
    }

    // Tahap 1: Keluhan
    if (stage === "symptom") {
      setSymptom(text);
      setStage("duration");

      addBotMessage(
        "Baik, terima kasih sudah bercerita. Sudah berapa lama kamu mengalami keluhan tersebut?"
      );
    }

    // Tahap 2: Durasi
    else if (stage === "duration") {
      setDuration(text);
      setStage("exposure");

      addBotMessage(
        "Apakah kamu atau orang yang mengalami keluhan sempat terpapar asap kebakaran hutan atau polusi udara?"
      );
    }

    // Tahap 3: Paparan asap
    else if (stage === "exposure") {
      setExposure(text);
      setStage("done");

      addBotMessage(
        "Terima kasih! Informasi konsultasi awal kamu sudah berhasil dikumpulkan. Sekarang kamu bisa melihat ringkasan keluhan dan pilihan dokter."
      );
    }
  };

  // Pilihan jawaban cepat berdasarkan tahap
  const quickReplies =
    stage === "symptom"
      ? [
          "Batuk",
          "Sesak napas",
          "Pilek / iritasi",
          "Demam",
          "Tenggorokan sakit",
        ]
      : stage === "duration"
      ? ["Baru hari ini", "1–3 hari", "Lebih dari 3 hari"]
      : stage === "exposure"
      ? [
          "Ya, terpapar asap",
          "Tidak terpapar",
          "Tidak yakin",
        ]
      : [];

  // Rekomendasi berdasarkan informasi yang dikumpulkan.
  // Ini hanya aturan demonstrasi, bukan keputusan klinis.
  const getRecommendedDoctors = () => {
    const lower = symptom.toLowerCase();

    if (lower.includes("anak") || lower.includes("balita")) {
      return [doctors[2], doctors[0]];
    }

    if (
      lower.includes("sesak") ||
      lower.includes("asma") ||
      exposure.toLowerCase().includes("terpapar")
    ) {
      return [doctors[1], doctors[0]];
    }

    return [doctors[0], doctors[1]];
  };

  const recommendedDoctors = getRecommendedDoctors();

  const resetChat = () => {
    setStage("symptom");
    setInput("");
    setSymptom("");
    setDuration("");
    setExposure("");
    setSelectedDoctor(null);

    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Halo! 👋 Selamat datang kembali di NapasAI. Apa keluhan pernapasan yang sedang kamu rasakan?",
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F6F9F5]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      {/* HEADER */}
      <View className="bg-[#267A4B] px-5 pt-12 pb-6 rounded-b-[28px]">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
            <Text className="text-2xl">🌿</Text>
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-white text-xl font-bold">
              NapasAI
            </Text>
            <Text className="text-green-100 text-xs">
              Asisten Kesehatan Pernapasan
            </Text>
          </View>

          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-800 text-xs font-semibold">
              ● Online
            </Text>
          </View>
        </View>

        <Text className="text-white/80 text-xs mt-4">
          Teman konsultasi untuk menjaga kesehatan pernapasanmu.
        </Text>
      </View>

      {/* AREA CHAT */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`flex-row mb-4 ${
              message.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {message.sender === "bot" && (
              <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2">
                <Text>🌿</Text>
              </View>
            )}

            <View
              className={`max-w-[82%] px-4 py-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-[#267A4B] rounded-br-sm"
                  : "bg-white rounded-bl-sm border border-gray-100"
              }`}
            >
              <Text
                className={`text-sm leading-6 ${
                  message.sender === "user"
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {/* PILIHAN JAWABAN */}
        {quickReplies.length > 0 && (
          <View className="ml-10 flex-row flex-wrap gap-2 mb-5">
            {quickReplies.map((item) => (
              <Pressable
                key={item}
                onPress={() => sendMessage(item)}
                className="bg-white border border-[#267A4B] px-4 py-2 rounded-full"
              >
                <Text className="text-[#267A4B] text-xs font-semibold">
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* PERINGATAN DARURAT */}
        {stage === "urgent" && (
          <View className="bg-red-50 border border-red-200 p-4 rounded-xl mb-5">
            <Text className="text-red-700 font-bold">
              Prioritaskan pertolongan medis
            </Text>
            <Text className="text-red-600 text-xs mt-2 leading-5">
              Jangan menunggu rekomendasi dokter dari aplikasi.
              Segera cari bantuan medis.
            </Text>

            <Pressable
              onPress={resetChat}
              className="mt-3 bg-red-600 rounded-lg p-3 items-center"
            >
              <Text className="text-white font-semibold">
                Mulai Konsultasi Baru
              </Text>
            </Pressable>
          </View>
        )}

        {/* RINGKASAN DAN REKOMENDASI */}
        {stage === "done" && (
          <View className="mt-2 mb-5">

            {/* RINGKASAN */}
            <View className="bg-white rounded-2xl p-4 border border-gray-100">
              <View className="flex-row items-center mb-3">
                <Text className="text-lg mr-2">📋</Text>
                <Text className="text-gray-800 text-base font-bold">
                  Ringkasan Keluhan
                </Text>
              </View>

              <View className="bg-green-50 rounded-xl p-3 mb-3">
                <Text className="text-green-800 text-xs font-semibold">
                  Hasil konsultasi awal NapasAI
                </Text>
                <Text className="text-green-700 text-xs mt-1">
                  Informasi berdasarkan jawaban yang kamu berikan.
                </Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-500 text-sm">
                  Keluhan
                </Text>
                <Text className="text-gray-800 text-sm font-semibold">
                  {symptom}
                </Text>
              </View>

              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-500 text-sm">
                  Durasi
                </Text>
                <Text className="text-gray-800 text-sm font-semibold">
                  {duration}
                </Text>
              </View>

              <View className="flex-row justify-between py-2">
                <Text className="text-gray-500 text-sm">
                  Paparan asap
                </Text>
                <Text className="text-gray-800 text-sm font-semibold">
                  {exposure}
                </Text>
              </View>

              <Text className="text-gray-400 text-[10px] mt-3 leading-4">
                Ringkasan ini bukan diagnosis medis dan perlu
                dikonfirmasi oleh tenaga kesehatan.
              </Text>
            </View>

            {/* REKOMENDASI DOKTER */}
            <View className="mt-5">
              <Text className="text-gray-800 text-lg font-bold">
                Rekomendasi Dokter
              </Text>

              <Text className="text-gray-500 text-xs mt-1 mb-3">
                Pilihan awal berdasarkan informasi keluhanmu.
              </Text>

              {recommendedDoctors.map((doctor, index) => (
                <View
                  key={doctor.id}
                  className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
                >
                  <View className="flex-row items-center">
                    <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                      <Text className="text-[#267A4B] font-bold">
                        {doctor.initial}
                      </Text>
                    </View>

                    <View className="flex-1 ml-3">
                      <Text className="text-gray-800 font-bold text-sm">
                        {doctor.name}
                      </Text>

                      <Text className="text-[#267A4B] text-xs mt-1">
                        {doctor.specialist}
                      </Text>
                    </View>

                    {index === 0 && (
                      <View className="bg-green-100 px-2 py-1 rounded-full">
                        <Text className="text-green-800 text-[10px] font-semibold">
                          Pilihan awal
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-gray-500 text-xs mt-3">
                    {doctor.description}
                  </Text>

                  <Text className="text-gray-500 text-xs mt-2">
                    🗓 {doctor.schedule}
                  </Text>

                  <View className="bg-yellow-50 rounded-lg p-2 mt-3">
                    <Text className="text-yellow-800 text-[10px]">
                      Jadwal dan identitas dokter merupakan data
                      simulasi, bukan ketersediaan aktual.
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setSelectedDoctor(doctor.id)}
                    className={`mt-3 rounded-xl py-3 items-center ${
                      selectedDoctor === doctor.id
                        ? "bg-green-100 border border-[#267A4B]"
                        : "bg-[#267A4B]"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        selectedDoctor === doctor.id
                          ? "text-[#267A4B]"
                          : "text-white"
                      }`}
                    >
                      {selectedDoctor === doctor.id
                        ? "✓ Dokter Dipilih"
                        : "Pilih Dokter"}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {selectedDoctor !== null && (
              <View className="bg-green-50 border border-green-200 rounded-xl p-4">
                <Text className="text-green-800 font-bold">
                  Dokter berhasil dipilih!
                </Text>
                <Text className="text-green-700 text-xs mt-1">
                  Tahap selanjutnya adalah pemilihan jadwal booking.
                  Fitur booking akan kita hubungkan berikutnya.
                </Text>
              </View>
            )}

            <Pressable
              onPress={resetChat}
              className="mt-4 border border-gray-300 rounded-xl py-3 items-center"
            >
              <Text className="text-gray-600 font-semibold">
                Mulai Konsultasi Baru
              </Text>
            </Pressable>
          </View>
        )}

        <Text className="text-gray-400 text-[10px] text-center mb-3">
          NapasAI bukan pengganti diagnosis dan pemeriksaan dokter.
        </Text>
      </ScrollView>

      {/* INPUT CHAT */}
      <View className="bg-white px-4 py-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={
              stage === "done" || stage === "urgent"
                ? "Percakapan selesai"
                : "Ceritakan keluhanmu..."
            }
            placeholderTextColor="#9CA3AF"
            editable={stage !== "done" && stage !== "urgent"}
            multiline
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm max-h-24"
          />

          <Pressable
            onPress={() => sendMessage()}
            disabled={
              !input.trim() ||
              stage === "done" ||
              stage === "urgent"
            }
            className={`ml-2 w-12 h-12 rounded-full items-center justify-center ${
              input.trim() &&
              stage !== "done" &&
              stage !== "urgent"
                ? "bg-[#267A4B]"
                : "bg-gray-300"
            }`}
          >
            <Text className="text-white text-xl">➤</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
