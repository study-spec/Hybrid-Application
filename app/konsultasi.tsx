
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type Stage =
  | "symptom"
  | "duration"
  | "exposure"
  | "done"
  | "method"
  | "booking"
  | "booked"
  | "urgent";

type ConsultationMethod = "onsite" | "online";
type OnlinePlatform = "zoom" | "videocall";

type ChatMessage = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

type Doctor = {
  id: number;
  name: string;
  specialist: string;
  description: string;
  facility: string;
  address: string;
  schedule: string;
  initial: string;
  slots: string[];
};

const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Andi Pratama",
    specialist: "Dokter Umum",
    description: "Evaluasi awal keluhan kesehatan",
    facility: "Klinik Sehat Bersama",
    address: "Jl. Kesehatan No. 10",
    schedule: "Senin - Jumat",
    initial: "AP",
    slots: ["09:00", "10:00", "13:00", "15:00"],
  },
  {
    id: 2,
    name: "Dr. Siti Rahma, Sp.P",
    specialist: "Spesialis Paru",
    description: "Evaluasi gangguan sistem pernapasan",
    facility: "Klinik Paru Sehat",
    address: "Jl. Melati No. 25",
    schedule: "Selasa - Sabtu",
    initial: "SR",
    slots: ["08:00", "10:00", "11:00", "14:00"],
  },
  {
    id: 3,
    name: "Dr. Budi Santoso, Sp.A",
    specialist: "Spesialis Anak",
    description: "Pelayanan kesehatan anak",
    facility: "Klinik Anak Ceria",
    address: "Jl. Anggrek No. 15",
    schedule: "Senin - Kamis",
    initial: "BS",
    slots: ["09:00", "11:00", "13:00"],
  },
];

const dangerKeywords = [
  "sesak berat",
  "sulit bernapas",
  "susah bernapas",
  "bibir biru",
  "pingsan",
  "tidak bisa bicara",
  "tidak bisa bernafas",
  "sulit bernafas",
];

function isDangerous(text: string) {
  const normalized = text.toLowerCase();

  return dangerKeywords.some((keyword) =>
    normalized.includes(keyword)
  );
}

function getRecommendedDoctors(
  symptom: string,
  exposure: string
): Doctor[] {
  const text = symptom.toLowerCase();

  if (
    text.includes("anak") ||
    text.includes("balita") ||
    text.includes("bayi")
  ) {
    return [doctors[2], doctors[0]];
  }

  if (
    text.includes("asma") ||
    text.includes("sesak") ||
    text.includes("napas") ||
    text.includes("batuk") ||
    exposure.toLowerCase().includes("sering")
  ) {
    return [doctors[1], doctors[0]];
  }

  return [doctors[0], doctors[1]];
}

function isValidFutureDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today;
}


export default function KonsultasiScreen() {
  const [stage, setStage] = useState<Stage>("symptom");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "bot",
      text: "Halo! Saya NapasAI. Saya akan membantu memahami keluhan pernapasan kamu. Apa gejala yang sedang dirasakan?",
    },
  ]);

  const [input, setInput] = useState("");

  const [symptom, setSymptom] = useState("");
  const [duration, setDuration] = useState("");
  const [exposure, setExposure] = useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [consultationMethod, setConsultationMethod] =
    useState<ConsultationMethod | null>(null);

  const [onlinePlatform, setOnlinePlatform] =
    useState<OnlinePlatform | null>(null);

  const [patientName, setPatientName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [bookingError, setBookingError] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");

  // Rekomendasi dokter
  const recommendedDoctors = getRecommendedDoctors(
    symptom,
    exposure
  );

  const addMessage = (
    sender: "bot" | "user",
    text: string
  ) => {
    setMessages((previous) => [
      ...previous,
      {
        id: Date.now() + Math.random(),
        sender,
        text,
      },
    ]);
  };

  const submitAnswer = (answer: string) => {
    const cleanAnswer = answer.trim();

    if (!cleanAnswer) return;

    addMessage("user", cleanAnswer);
    setInput("");

    if (isDangerous(cleanAnswer)) {
      addMessage(
        "bot",
        "Keluhan yang kamu sampaikan dapat menandakan kondisi darurat. Segera cari pertolongan medis di IGD atau hubungi layanan darurat setempat. Jangan menunggu proses chatbot atau booking."
      );

      setStage("urgent");
      return;
    }

    if (stage === "symptom") {
      setSymptom(cleanAnswer);

      addMessage(
        "bot",
        "Sudah berapa lama gejala tersebut kamu alami?"
      );

      setStage("duration");
      return;
    }

    if (stage === "duration") {
      setDuration(cleanAnswer);

      addMessage(
        "bot",
        "Apakah kamu sering terpapar asap kebakaran hutan, asap rokok, atau polusi udara?"
      );

      setStage("exposure");
      return;
    }

    if (stage === "exposure") {
      setExposure(cleanAnswer);

      addMessage(
        "bot",
        "Terima kasih! Informasi kamu sudah dicatat. Berikut ringkasan keluhan dan rekomendasi dokter berdasarkan jawaban awal kamu."
      );

      setStage("done");
    }
  };

  const resetChat = () => {
    setStage("symptom");

    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Halo! Saya NapasAI. Saya akan membantu memahami keluhan pernapasan kamu. Apa gejala yang sedang dirasakan?",
      },
    ]);

    setInput("");
    setSymptom("");
    setDuration("");
    setExposure("");

    setSelectedDoctor(null);
    setConsultationMethod(null);
    setOnlinePlatform(null);

    setPatientName("");
    setBookingDate("");
    setSelectedTime("");

    setBookingError("");
    setTicketNumber("");
  };

  // ===============================
  // DOCTOR SELECTION
  // ===============================

  const selectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);

    setConsultationMethod(null);
    setOnlinePlatform(null);
    setSelectedTime("");
    setBookingError("");

    setStage("method");
  };

  const selectMethod = (method: ConsultationMethod) => {
    setConsultationMethod(method);

    setOnlinePlatform(null);
    setSelectedTime("");
    setBookingError("");

    setStage("booking");
  };

  // ===============================
  // CONFIRM BOOKING
  // ===============================

  const confirmBooking = () => {
    if (!selectedDoctor || !consultationMethod) {
      setBookingError(
        "Silakan pilih dokter dan metode konsultasi."
      );
      return;
    }

    if (!patientName.trim()) {
      setBookingError("Nama pasien harus diisi.");
      return;
    }

    if (!isValidFutureDate(bookingDate)) {
      setBookingError(
        "Masukkan tanggal yang valid dan bukan tanggal yang sudah lewat. Format: YYYY-MM-DD."
      );
      return;
    }

    if (!selectedTime) {
      setBookingError("Silakan pilih jam konsultasi.");
      return;
    }

    if (
      consultationMethod === "online" &&
      !onlinePlatform
    ) {
      setBookingError(
        "Silakan pilih media konsultasi online."
      );
      return;
    }

    const newTicket =
      "NA-" + Date.now().toString().slice(-6);

    setTicketNumber(newTicket);
    setBookingError("");
    setStage("booked");
  };

  const PrimaryButton = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className="bg-green-700 rounded-xl py-3.5 px-4 items-center"
    >
      <Text className="text-white font-semibold text-sm">
        {title}
      </Text>
    </Pressable>
  );

  const OptionButton = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className="border border-green-200 bg-white rounded-xl px-4 py-3 mb-2"
    >
      <Text className="text-green-800 font-medium text-sm">
        {title}
      </Text>
    </Pressable>
  );

  const SectionTitle = ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <View className="mb-4">
      <Text className="text-xl font-bold text-gray-900">
        {title}
      </Text>

      {subtitle ? (
        <Text className="text-gray-500 text-sm mt-1">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  const DoctorCard = ({
    doctor,
  }: {
    doctor: Doctor;
  }) => (
    <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-3">
          <Text className="text-green-800 font-bold">
            {doctor.initial}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="font-bold text-gray-900">
            {doctor.name}
          </Text>

          <Text className="text-green-700 text-sm">
            {doctor.specialist}
          </Text>
        </View>
      </View>

      <Text className="text-gray-600 text-sm mb-3">
        {doctor.description}
      </Text>

      <View className="bg-gray-50 rounded-xl p-3 mb-3">
        <Text className="text-gray-800 text-sm font-semibold">
          {doctor.facility}
        </Text>

        <Text className="text-gray-500 text-xs mt-1">
          {doctor.address}
        </Text>

        <Text className="text-gray-500 text-xs mt-1">
          Jadwal contoh: {doctor.schedule}
        </Text>
      </View>

      <PrimaryButton
        title="Pilih Dokter"
        onPress={() => selectDoctor(doctor)}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#F6F9F5]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1">

        {/* HEADER */}
        <View className="bg-green-700 px-5 pt-12 pb-5 rounded-b-3xl">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-2xl font-bold">
                NapasAI
              </Text>

              <Text className="text-green-100 text-sm mt-1">
                Asisten kesehatan pernapasan
              </Text>
            </View>

            <View className="bg-white/20 rounded-full px-3 py-2">
              <Text className="text-white text-xs font-semibold">
                Konsultasi
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 18,
            paddingBottom: 35,
          }}
          keyboardShouldPersistTaps="handled"
        >

          {/* ===================== */}
          {/* CHATBOT */}
          {/* ===================== */}

          {(
            stage === "symptom" ||
            stage === "duration" ||
            stage === "exposure"
          ) && (
            <>
              <View className="mb-4">
                <Text className="text-lg font-bold text-gray-900">
                  Konsultasi dengan NapasAI
                </Text>

                <Text className="text-gray-500 text-sm mt-1">
                  Jawab beberapa pertanyaan untuk mendapatkan
                  rekomendasi awal.
                </Text>
              </View>

              {/* CHAT MESSAGES */}
              {messages.map((message) => (
                <View
                  key={message.id}
                  className={`mb-3 max-w-[88%] ${
                    message.sender === "user"
                      ? "self-end"
                      : "self-start"
                  }`}
                >
                  <View
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-green-700 rounded-br-sm"
                        : "bg-white border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    <Text
                      className={`text-sm leading-6 ${
                        message.sender === "user"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {message.text}
                    </Text>
                  </View>

                  <Text className="text-gray-400 text-xs mt-1 mx-1">
                    {message.sender === "user"
                      ? "Kamu"
                      : "NapasAI"}
                  </Text>
                </View>
              ))}

              {/* DURASI */}
              {stage === "duration" && (
                <View className="mt-2">
                  <OptionButton
                    title="Kurang dari 1 hari"
                    onPress={() =>
                      submitAnswer("Kurang dari 1 hari")
                    }
                  />

                  <OptionButton
                    title="1 - 3 hari"
                    onPress={() => submitAnswer("1 - 3 hari")}
                  />

                  <OptionButton
                    title="Lebih dari 3 hari"
                    onPress={() =>
                      submitAnswer("Lebih dari 3 hari")
                    }
                  />

                  <OptionButton
                    title="Lebih dari 1 minggu"
                    onPress={() =>
                      submitAnswer("Lebih dari 1 minggu")
                    }
                  />
                </View>
              )}

              {/* PAPARAN ASAP */}
              {stage === "exposure" && (
                <View className="mt-2">
                  <OptionButton
                    title="Ya, sering terpapar"
                    onPress={() =>
                      submitAnswer("Ya, sering terpapar")
                    }
                  />

                  <OptionButton
                    title="Kadang-kadang"
                    onPress={() =>
                      submitAnswer("Kadang-kadang")
                    }
                  />

                  <OptionButton
                    title="Tidak pernah"
                    onPress={() =>
                      submitAnswer("Tidak pernah")
                    }
                  />
                </View>
              )}

              {/* CHAT INPUT */}
              <View className="flex-row items-center mt-4">
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Ketik jawaban kamu..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                  onSubmitEditing={() => submitAnswer(input)}
                  returnKeyType="send"
                />

                <Pressable
                  onPress={() => submitAnswer(input)}
                  className="bg-green-700 rounded-xl p-3 ml-2"
                >
                  <Text className="text-white font-bold">
                    Kirim
                  </Text>
                </Pressable>
              </View>

              <Text className="text-gray-400 text-xs mt-3 leading-5">
                NapasAI hanya memberikan informasi awal,
                bukan diagnosis medis.
              </Text>
            </>
          )}

          {/* ===================== */}
          {/* URGENT */}
          {/* ===================== */}

          {stage === "urgent" && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <Text className="text-red-700 text-xl font-bold mb-2">
                Segera cari pertolongan medis
              </Text>

              <Text className="text-gray-700 text-sm leading-6 mb-4">
                Keluhan yang disampaikan dapat menandakan
                kondisi darurat. Segera ke IGD atau hubungi
                layanan darurat setempat. Jangan menunggu
                konsultasi online atau booking.
              </Text>

              <PrimaryButton
                title="Mulai Konsultasi Baru"
                onPress={resetChat}
              />
            </View>
          )}

          {/* ===================== */}
          {/* RINGKASAN & DOKTER */}
          {/* ===================== */}

          {stage === "done" && (
            <>
              <SectionTitle
                title="Ringkasan Keluhan"
                subtitle="Informasi yang kamu sampaikan."
              />

              <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
                <Text className="text-gray-500 text-xs mb-1">
                  Gejala
                </Text>

                <Text className="text-gray-900 font-semibold mb-3">
                  {symptom}
                </Text>

                <Text className="text-gray-500 text-xs mb-1">
                  Durasi
                </Text>

                <Text className="text-gray-900 font-semibold mb-3">
                  {duration}
                </Text>

                <Text className="text-gray-500 text-xs mb-1">
                  Paparan asap atau polusi
                </Text>

                <Text className="text-gray-900 font-semibold">
                  {exposure}
                </Text>
              </View>

              <SectionTitle
                title="Rekomendasi Dokter"
                subtitle="Pilihan awal berdasarkan informasi yang kamu berikan."
              />

              {recommendedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                />
              ))}

              <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-2 mb-4">
                <Text className="text-yellow-800 text-xs leading-5">
                  Rekomendasi ini bukan diagnosis medis dan
                  perlu dikonfirmasi oleh tenaga medis.
                  Jika gejala memburuk, segera cari pertolongan.
                </Text>
              </View>

              <Pressable
                onPress={resetChat}
                className="py-3 items-center"
              >
                <Text className="text-green-700 font-semibold">
                  Mulai konsultasi baru
                </Text>
              </Pressable>
            </>
          )}

          {/* ===================== */}
          {/* PILIH METODE */}
          {/* ===================== */}

          {stage === "method" && selectedDoctor && (
            <>
              <SectionTitle
                title="Pilih Metode Konsultasi"
                subtitle="Tentukan cara konsultasi dengan dokter."
              />

              <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-5">
                <Text className="text-gray-500 text-xs">
                  Dokter pilihan
                </Text>

                <Text className="text-gray-900 font-bold mt-1">
                  {selectedDoctor.name}
                </Text>

                <Text className="text-green-700 text-sm">
                  {selectedDoctor.specialist}
                </Text>
              </View>

              {/* ONSITE */}
              <Pressable
                onPress={() => selectMethod("onsite")}
                className="bg-white border border-gray-200 rounded-2xl p-5 mb-3"
              >
                <View className="flex-row items-center mb-3">
                  <View className="bg-green-100 w-12 h-12 rounded-xl items-center justify-center mr-3">
                    <Text className="text-2xl">🏥</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">
                      Konsultasi Onsite
                    </Text>

                    <Text className="text-gray-500 text-xs mt-1">
                      Datang langsung ke fasilitas kesehatan.
                    </Text>
                  </View>
                </View>

                <Text className="text-green-700 font-semibold text-sm">
                  Pilih Onsite →
                </Text>
              </Pressable>

              {/* ONLINE */}
              <Pressable
                onPress={() => selectMethod("online")}
                className="bg-white border border-gray-200 rounded-2xl p-5 mb-4"
              >
                <View className="flex-row items-center mb-3">
                  <View className="bg-blue-100 w-12 h-12 rounded-xl items-center justify-center mr-3">
                    <Text className="text-2xl">📹</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base">
                      Konsultasi Online
                    </Text>

                    <Text className="text-gray-500 text-xs mt-1">
                      Konsultasi dari rumah melalui video call.
                    </Text>
                  </View>
                </View>

                <Text className="text-green-700 font-semibold text-sm">
                  Pilih Online →
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setStage("done")}
                className="py-3 items-center"
              >
                <Text className="text-gray-500 font-medium">
                  Kembali ke rekomendasi dokter
                </Text>
              </Pressable>
            </>
          )}

          {/* ===================== */}
          {/* FORM BOOKING */}
          {/* ===================== */}

          {stage === "booking" && selectedDoctor && (
            <>
              <SectionTitle
                title={
                  consultationMethod === "onsite"
                    ? "Booking Onsite"
                    : "Booking Online"
                }
                subtitle="Lengkapi data untuk membuat jadwal konsultasi."
              />

              {/* DOCTOR INFO */}
              <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-5">
                <Text className="text-gray-500 text-xs">
                  Dokter pilihan
                </Text>

                <Text className="text-gray-900 font-bold mt-1">
                  {selectedDoctor.name}
                </Text>

                <Text className="text-green-700 text-sm">
                  {selectedDoctor.specialist}
                </Text>
              </View>

              {/* PATIENT NAME */}
              <Text className="text-gray-800 font-semibold mb-2">
                Nama Pasien
              </Text>

              <TextInput
                value={patientName}
                onChangeText={setPatientName}
                placeholder="Masukkan nama pasien"
                placeholderTextColor="#9CA3AF"
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-800"
              />

              {/* BOOKING DATE */}
              <Text className="text-gray-800 font-semibold mb-2">
                Tanggal Konsultasi
              </Text>

              <TextInput
                value={bookingDate}
                onChangeText={setBookingDate}
                placeholder="YYYY-MM-DD, contoh: 2026-11-20"
                placeholderTextColor="#9CA3AF"
                className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-1 text-gray-800"
              />

              <Text className="text-gray-400 text-xs mb-4">
                Gunakan format tahun-bulan-tanggal.
              </Text>

              {/* TIME SLOTS */}
              <Text className="text-gray-800 font-semibold mb-3">
                Pilih Jam Konsultasi
              </Text>

              <View className="flex-row flex-wrap mb-4">
                {selectedDoctor.slots.map((slot) => (
                  <Pressable
                    key={slot}
                    onPress={() => setSelectedTime(slot)}
                    className={`rounded-xl border px-4 py-3 mr-2 mb-2 ${
                      selectedTime === slot
                        ? "bg-green-700 border-green-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-sm ${
                        selectedTime === slot
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {slot}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* ONSITE DETAILS */}
              {consultationMethod === "onsite" && (
                <View className="mb-5">
                  <Text className="text-gray-800 font-semibold mb-2">
                    Lokasi Konsultasi
                  </Text>

                  <View className="bg-white border border-gray-200 rounded-xl p-4">
                    <Text className="text-gray-900 font-semibold">
                      {selectedDoctor.facility}
                    </Text>

                    <Text className="text-gray-500 text-sm mt-1">
                      {selectedDoctor.address}
                    </Text>

                    <Text className="text-green-700 text-xs mt-2">
                      Lokasi praktik contoh
                    </Text>
                  </View>
                </View>
              )}

              {/* ONLINE PLATFORM */}
              {consultationMethod === "online" && (
                <View className="mb-5">
                  <Text className="text-gray-800 font-semibold mb-3">
                    Pilih Media Konsultasi
                  </Text>

                  <Pressable
                    onPress={() => setOnlinePlatform("zoom")}
                    className={`rounded-xl border p-4 mb-2 ${
                      onlinePlatform === "zoom"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text className="font-semibold text-gray-900">
                      Zoom Meeting
                    </Text>

                    <Text className="text-gray-500 text-xs mt-1">
                      Konsultasi melalui ruang meeting Zoom.
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setOnlinePlatform("videocall")}
                    className={`rounded-xl border p-4 ${
                      onlinePlatform === "videocall"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text className="font-semibold text-gray-900">
                      Video Call
                    </Text>

                    <Text className="text-gray-500 text-xs mt-1">
                      Konsultasi melalui fitur video call aplikasi.
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* ERROR MESSAGE */}
              {bookingError !== "" && (
                <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <Text className="text-red-700 text-sm">
                    {bookingError}
                  </Text>
                </View>
              )}

              {/* CONFIRM */}
              <PrimaryButton
                title="Konfirmasi Booking"
                onPress={confirmBooking}
              />

              <Pressable
                onPress={() => setStage("method")}
                className="py-4 items-center"
              >
                <Text className="text-gray-500 font-medium">
                  Kembali pilih metode konsultasi
                </Text>
              </Pressable>
            </>
          )}

          {/* ===================== */}
          {/* BOOKING TICKET */}
          {/* ===================== */}

          {stage === "booked" && selectedDoctor && (
            <>
              <View className="items-center mb-5 mt-2">
                <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
                  <Text className="text-3xl">✓</Text>
                </View>

                <Text className="text-xl font-bold text-gray-900">
                  Booking Berhasil Dibuat!
                </Text>

                <Text className="text-gray-500 text-sm mt-1 text-center">
                  Berikut ringkasan booking konsultasi kamu.
                </Text>
              </View>

              {/* TICKET */}
              <View className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <View className="bg-green-700 p-5 items-center">
                  <Text className="text-green-100 text-xs">
                    NOMOR TIKET KONSULTASI
                  </Text>

                  <Text className="text-white text-3xl font-bold mt-2">
                    {ticketNumber}
                  </Text>

                  <Text className="text-green-100 text-xs mt-2">
                    NapasAI Consultation
                  </Text>
                </View>

                <View className="p-5">

                  <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 text-sm">
                      Nama Pasien
                    </Text>

                    <Text className="text-gray-900 font-semibold text-sm">
                      {patientName}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 text-sm">
                      Dokter
                    </Text>

                    <Text className="text-gray-900 font-semibold text-sm flex-1 text-right ml-4">
                      {selectedDoctor.name}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 text-sm">
                      Metode
                    </Text>

                    <Text className="text-gray-900 font-semibold text-sm">
                      {consultationMethod === "onsite"
                        ? "Onsite"
                        : "Online"}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 text-sm">
                      Tanggal
                    </Text>

                    <Text className="text-gray-900 font-semibold text-sm">
                      {bookingDate}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 text-sm">
                      Jam
                    </Text>

                    <Text className="text-gray-900 font-semibold text-sm">
                      {selectedTime}
                    </Text>
                  </View>

                  {consultationMethod === "onsite" ? (
                    <View className="mb-4">
                      <Text className="text-gray-500 text-sm mb-1">
                        Lokasi
                      </Text>

                      <Text className="text-gray-900 font-semibold text-sm">
                        {selectedDoctor.facility}
                      </Text>

                      <Text className="text-gray-500 text-xs mt-1">
                        {selectedDoctor.address}
                      </Text>
                    </View>
                  ) : (
                    <View className="mb-4">
                      <Text className="text-gray-500 text-sm mb-1">
                        Media Konsultasi
                      </Text>

                      <Text className="text-gray-900 font-semibold text-sm">
                        {onlinePlatform === "zoom"
                          ? "Zoom Meeting"
                          : "Video Call"}
                      </Text>
                    </View>
                  )}

                  <View className="border-t border-dashed border-gray-300 pt-4 mt-1">
                    <Text className="text-gray-500 text-xs text-center">
                      Simpan nomor tiket ini sebagai referensi
                      booking simulasi.
                    </Text>
                  </View>
                </View>
              </View>

              {/* ONLINE INFORMATION */}
              {consultationMethod === "online" && (
                <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <Text className="text-blue-800 font-semibold text-sm mb-1">
                    Informasi Konsultasi Online
                  </Text>

                  <Text className="text-blue-700 text-xs leading-5">
                    Tautan Zoom atau video call belum dibuat.
                    Pada implementasi sebenarnya, tautan akan
                    diberikan setelah jadwal dikonfirmasi oleh
                    fasilitas kesehatan atau dokter.
                  </Text>
                </View>
              )}

              {/* DISCLAIMER */}
              <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                <Text className="text-yellow-800 text-xs leading-5">
                  Perhatian: Ini merupakan tiket booking
                  simulasi untuk demonstrasi aplikasi. Belum
                  menjadi janji temu resmi dan belum menjamin
                  ketersediaan dokter.
                </Text>
              </View>

              <View className="mt-5">
                <PrimaryButton
                  title="Selesai"
                  onPress={resetChat}
                />
              </View>
            </>
          )}

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
