import {
  StyleSheet,
  Modal,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import EmojiPicker from "./emojiPicker";
import { useState } from "react";
import Sticker from "./sticker";

const { width, height } = Dimensions.get("screen");
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default function ModalEditImage({
  visible,
  onClose,
  uri,
  imageMirror,
  imageWidth,
  imageHeight,
}) {
  const [modalSticker, setModalSticker] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);

  // Escalas para alterar tamanho da imagem
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  // Posições para arrastar imagem
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Ângulos para girar a imagem
  const angle = useSharedValue(0);
  const startAngle = useSharedValue(0);

  // Alterar tamanho da Imagem (pinça)
  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = clamp(
        startScale.value * event.scale,
        0.3,
        Math.min(width / 100, height / 100)
      );
    })
    .runOnJS(true);

  // Alterar posição da Imagem (arrastar)
  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  // Rotacior imagem
  const rotation = Gesture.Rotation()
    .onStart(() => {
      startAngle.value = angle.value;
    })
    .onUpdate((event) => {
      angle.value = startAngle.value + event.rotation;
    });

  // Gesto composto com todos os gestos
  const gestures = Gesture.Simultaneous(pinch, drag, rotation);

  // Atualizar o style
  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scaleX: imageMirror },
      { scale: scale.value },
      {
        translateX: imageMirror == -1 ? -translateX.value : translateX.value,
      },
      {
        translateY: translateY.value,
      },
      {
        rotate: imageMirror == -1 ? `${-angle.value}rad` : `${angle.value}rad`,
      },
    ],
  }));

  return (
    <Modal style={styles.container} animationType="slide" visible={visible}>
      {/* IMAGEM */}
      <GestureHandlerRootView>
        <GestureDetector gesture={gestures}>
          <SafeAreaView style={styles.container}>
            <View style={styles.areaImage}>
              {selectedSticker && <Sticker stickerSource={selectedSticker} />}
              <Animated.Image
                style={[
                  {
                    width: (imageWidth * height) / imageHeight,
                    height: height,
                    zIndex: 1,
                  },
                  boxAnimatedStyles,
                ]}
                source={{ uri: uri }}
              />
            </View>
          </SafeAreaView>
        </GestureDetector>
      </GestureHandlerRootView>

      {/* BOTÕES */}
      <View style={styles.buttonContainerModal}>
        {/* BOTÃO DE FECHAR MODAL DE EDITAR FOTO */}
        <TouchableOpacity style={styles.buttonModal} onPress={onClose}>
          <FontAwesome size={28} name="close" color={"white"} />
        </TouchableOpacity>

        <View style={styles.buttonContainerModal2}>
          {/* BOTÃO DE ADICIONAR STICKER */}
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={() => setModalSticker(true)}
          >
            <FontAwesome size={28} name="sticky-note" color={"white"} />
          </TouchableOpacity>

          {/* BOTÃO RESETAR STICKERS */}
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={() => setSelectedSticker(null)}
          >
            <FontAwesome size={28} name="rotate-right" color={"white"} />
          </TouchableOpacity>

          {/* BOTÃO DE SALVAR FOTO */}
          <TouchableOpacity style={styles.buttonModal}>
            <FontAwesome size={28} name="download" color={"white"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL DOS STICKERS */}
      <EmojiPicker
        isVisible={modalSticker}
        onClose={() => setModalSticker(false)}
        onSelect={setSelectedSticker}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    //BODY
    width: "100%",
    height: "100%",
    backgroundColor: "#0C0C0C",
    alignItems: "center",
    justifyContent: "center",
  },

  areaImage: {
    //ÁREA DA IMAGEM
    width: "100%",
    height: "100%",
    backgroundColor: "#0C0C0C",
    borderRadius: 20,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
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
