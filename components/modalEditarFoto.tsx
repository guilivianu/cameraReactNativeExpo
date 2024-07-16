import {
  StyleSheet,
  Modal,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ModalEditImage({ visible, onClose, uri, imageMirror }) {
  return (
    <Modal
      style={styles.container}
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      {/* IMAGEM */}
      <SafeAreaView
        style={{ width: "100%", height: "100%", borderRadius: 20 }}
        collapsable={false}
      >
        <Image
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            transform: [{ scaleX: imageMirror }],
          }}
          source={{ uri: uri }}
        />
      </SafeAreaView>

      {/* BOTÕES */}
      <View style={styles.buttonContainerModal}>
        {/* BOTÃO DE ADICIONAR STICKER */}
        <TouchableOpacity style={styles.buttonModal} onPress={onClose}>
          <FontAwesome size={28} name="close" color={"white"} />
        </TouchableOpacity>

        <View style={styles.buttonContainerModal2}>
          {/* BOTÃO RESETAR STICKERS */}
          <TouchableOpacity style={styles.buttonModal}>
            <FontAwesome size={28} name="sticky-note" color={"white"} />
          </TouchableOpacity>

          {/* BOTÃO RESETAR STICKERS */}
          <TouchableOpacity style={styles.buttonModal}>
            <FontAwesome size={28} name="rotate-right" color={"white"} />
          </TouchableOpacity>

          {/* BOTÃO DE SALVAR FOTO */}
          <TouchableOpacity style={styles.buttonModal}>
            <FontAwesome size={28} name="download" color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    //BODY
    flex: 1,
    backgroundColor: "#0C0C0C",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainerModal: {
    // CONTAINER DOS BOTÕES DO MODAL
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    gap: 8,

    paddingHorizontal: 24,
    marginVertical: 64,
  },

  buttonContainerModal2: {
    // CONTAINER 2 DOS BOTÕES DO MODAL
    flexDirection: "row",
    gap: 8,
  },

  buttonModal: {
    // BOTÕES DO MODAL
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: "black",
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
