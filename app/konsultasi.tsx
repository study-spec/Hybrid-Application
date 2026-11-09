import { Stack } from 'expo-router';
import React from 'react';
import {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

type Message = {
  id: number;
  text: string;
  sender: "bot" | "user";
};

type State = "symptom" | "duration" | "exposure" | "done" | "urgent";

export default function ConsultationScreen() {
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<State>("symptom");
  const [symptom, setSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [exposure, setExposure] = useState("");


  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Halo! 👋 Saya NapasAI, asisten kesehatan pernapasan kamu.",
    },
    {
      id: 2,
      sender: "bot",
      text: "Saya akan membantu mengenali keluhan pernapasanmu, terutama yang mungkin berkaitan dengan paparan asap karhutla.",
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

  const sendMessage = (value?: string) => {
    const text = (value ?? input).trim();

    if (!text || stage === "done" || stage === "urgent") return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text,
      },
    ]);

    setInput("");

    const lowerText = text.toLowerCase();

    // Pemeriksaan tanda bahaya
    const dangerWords = [
      "sesak berat",
      "sulit bernapas",
      "susah bernapas",
      "bibir biru",
      "sulit bicara",
      "tidak bisa bicara",
    ];

    if (dangerWords.some((word) => lowerText.includes(word))) {
      setStage("urgent");

      setTimeout(() => {
        addBotMessage(
          "⚠️ Keluhan yang kamu sampaikan dapat menjadi tanda kondisi darurat. Segera cari pertolongan medis ke IGD atau layanan darurat setempat. Jangan menunggu proses konsultasi chatbot selesai."
        );
      }, 500);

      return;
    }

    // Tahap 1: Keluhan
    if (stage === "symptom") {
      setSymptom(text);
      setStage("duration");

      setTimeout(() => {
        addBotMessage(
          "Baik, terima kasih sudah bercerita. Sudah berapa lama kamu mengalami keluhan tersebut?"
        );
      }, 500);
    }

    // Tahap 2: Durasi
    else if (stage === "duration") {
      setDuration(text);
      setStage("exposure");

      setTimeout(() => {
        addBotMessage(
          "Apakah kamu atau orang yang mengalami keluhan sempat terpapar asap kebakaran hutan atau polusi udara?"
        );
      }, 500);
    }

    // Tahap 3: Paparan asap
    else if (stage === "exposure") {
      setExposure(text);
      setStage("done");

      setTimeout(() => {
        addBotMessage(
          "Terima kasih! Berikut ringkasan informasi yang kamu berikan:\n\n" +
            "• Keluhan: " + symptom +
            "\n• Durasi: " + duration +
            "\n• Paparan asap: " + text +
            "\n\nInformasi ini belum merupakan diagnosis medis. Sebaiknya konsultasikan keluhanmu dengan tenaga kesehatan untuk mendapatkan pemeriksaan yang tepat."
        );

        addBotMessage(
          "Kamu sudah menyelesaikan konsultasi awal bersama NapasAI. Selanjutnya, kamu dapat melihat pilihan dokter yang sesuai."
        );
      }, 500);
    }
  };

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
      ? ["Ya, terpapar asap", "Tidak terpapar", "Tidak yakin"]
      : [];

  const resetChat = () => {
    setStage("symptom");
    setInput("");
    setSymptom("");
    setDuration("");
    setExposure("");

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

        {/* SELESAI */}
        {stage === "done" && (
          <Pressable
            onPress={resetChat}
            className="bg-[#267A4B] py-3 rounded-xl items-center mb-5"
          >
            <Text className="text-white font-semibold">
              Mulai Konsultasi Baru
            </Text>
          </Pressable>
        )}

        {stage === "urgent" && (
          <View className="bg-red-50 border border-red-200 p-4 rounded-xl mb-5">
            <Text className="text-red-700 font-bold">
              Prioritaskan pertolongan medis
            </Text>
            <Text className="text-red-600 text-xs mt-1">
              Chatbot tidak dapat menangani kondisi darurat.
            </Text>
          </View>
        )}

        <Text className="text-gray-400 text-[10px] text-center mb-2">
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
              input.trim() && stage !== "done" && stage !== "urgent"
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