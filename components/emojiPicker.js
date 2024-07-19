import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function EmojiPicker({ isVisible, onClose, onSelect }) {
  // Lista de stickers
  const [stickers] = useState([
    require("../assets/stickers/emoji1.png"),
    require("../assets/stickers/emoji2.png"),
    require("../assets/stickers/emoji3.png"),
    require("../assets/stickers/emoji4.png"),
    require("../assets/stickers/emoji5.png"),
    require("../assets/stickers/emoji6.png"),
    require("../assets/stickers/emoji7.png"),
    require("../assets/stickers/emoji8.png"),
    require("../assets/stickers/emoji9.png"),
    require("../assets/stickers/emoji10.png"),
    require("../assets/stickers/emoji11.png"),
    require("../assets/stickers/emoji12.png"),
    require("../assets/stickers/emoji13.png"),
    require("../assets/stickers/emoji14.png"),
    require("../assets/stickers/emoji15.png"),
    require("../assets/stickers/emoji16.png"),
    require("../assets/stickers/emoji17.png"),
    require("../assets/stickers/emoji18.png"),
  ]);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      {/* View do Modal inteiro */}
      <View style={styles.modal}>
        {/* Título */}
        <View style={styles.titleContainer}>
          {/* Texto do título */}
          <Text style={styles.title}>Escolha um sticker</Text>

          {/* Botão de fechar modal */}
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </TouchableOpacity>
        </View>

        {/* Lista de stickers */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.stickersContainer}>
            {stickers.map((sticker, index) => {
              return (
                // Sticker
                <TouchableOpacity
                  onPress={() => {
                    onSelect(sticker);
                    onClose();
                  }}
                >
                  <Image source={sticker} key={index} style={styles.sticker} />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    // Body
    height: "75%",
    width: "100%",
    backgroundColor: "#0C0C0C",
    opacity: 0.95,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    position: "absolute",
    bottom: 0,
    paddingVertical: 24,
    paddingHorizontal: 32,
  },

  titleContainer: {
    // Container do título
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  title: {
    // Texto do título
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  stickersContainer: {
    // Container dos stickers (!= lista)
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "space-between",
  },
  sticker: {
    // Sticker
    width: 90,
    height: 90,
    objectFit: "contain",
    marginVertical: 8,
  },
});
