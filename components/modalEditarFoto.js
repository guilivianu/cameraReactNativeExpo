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
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

import EmojiPicker from "./emojiPicker";
import { useState, useRef } from "react";
import Sticker from "./sticker";

const { width, height } = Dimensions.get("screen"); // Dimensões da tela
function clamp(val, min, max) {
  // Função para pegar valor atual, mínimo e máximo para aumentar escala da foto
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
  const imageRef = useRef(null); // Referência da imagem (para salvar)
  const [modalSticker, setModalSticker] = useState(false); // Visibilidade do modal dos stickeres
  const [selectedSticker, setSelectedSticker] = useState(null); // Sticker selecionado

  // --------------------------------------------------------------------

  // ALTERAR TAMANHO DA IMAGEM
  // Variáveis
  const startScale = useSharedValue(0); // Escala inicial
  const scale = useSharedValue(1); // Escala atual

  // Gesto de "pinça"
  const pinch = Gesture.Pinch()
    .onStart(() => {
      // Início do gesto
      startScale.value = scale.value; // Iguala a escala inicial a escala atual da imagem no momento que o gesto inicia
    })
    .onUpdate((event) => {
      // Durante o gesto (em cada mudança)
      scale.value = clamp(
        startScale.value * event.scale, // val => Escala inicial x o aumento da escala (event.scale => a porcentagem que o movimento de pinça capta que aumentou)
        0.3, // min => Escala mínima que a imagem pode chegar
        Math.min(width / 100, height / 100) // max => Escala máxima que a imagem pode chegar
      );
    })
    .runOnJS(true);

  // --------------------------------------------------------------------

  // ALTERAR POSIÇÃO DA IMAGEM
  // Variáveis
  const translateX = useSharedValue(0); // Posição no eixo X
  const translateY = useSharedValue(0); // Posição no eixo Y

  // Gesto de arrastar
  const drag = Gesture.Pan().onChange((event) => {
    // Posição antes do gesto + mudança de posição (Obs: Está sendo dividido pela escala para dar fluidez ao movimento)
    translateX.value += event.changeX / scale.value; // Eixo X
    translateY.value += event.changeY / scale.value; // Eixo Y
  });

  // --------------------------------------------------------------------

  // GIRAR A IMAGEM
  // Variáveis
  const startAngle = useSharedValue(0); // Ângulo inicial (radianos)
  const angle = useSharedValue(0); // Ângulo atual (radianos)

  // Rotacior imagem
  const rotation = Gesture.Rotation()
    .onStart(() => {
      // Início do gesto
      startAngle.value = angle.value; // Iguala o ângulo inicial ao ângulo atual da imagem no momento que o gesto inicia
    })
    .onUpdate((event) => {
      // Durante o gesto (em cada mudança)
      angle.value = startAngle.value + event.rotation; // Ângulo final é igual a soma do ângulo inicial com a rotação durante o gesto
    });

  // --------------------------------------------------------------------

  // Gesto composto com todos os gestos ("Simultaneous" para que seja possível executar todos os gestos juntos)
  const gestures = Gesture.Simultaneous(pinch, drag, rotation);

  // Atualizar o style
  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { scaleX: imageMirror }, // Define se a imagem deve ser espelhada ou nâo (Obs: Imagem só é espelhada no eixo X)
      { scale: scale.value }, // Escala da imagem (gesto "drag")
      {
        translateX: imageMirror == -1 ? -translateX.value : translateX.value, // Posição no eixo X
        // Obs: Deve conter a verificação de se a imagem é espelhada ou não para o movimento da imagem na tela não ficar invertido
      },
      {
        translateY: translateY.value, // Posição no eixo Y
      },
      {
        rotate: imageMirror == -1 ? `${-angle.value}rad` : `${angle.value}rad`, // Ângulo de rotação da imagem (radianos)
        // Obs: Deve conter a verificação de se a imagem é espelhada ou não para a rotação da imagem não ficar invertida
      },
    ],
  }));

  // --------------------------------------------------------------------

  // Salvar a imagem
  async function saveImage() {
    try {
      // Captura a imagem de acordo com uma referência (imageRef => View da área delimitada da imagem)
      const localUri = await captureRef(imageRef, {
        quality: 1, // Define a qualidade da imagem como a máxima (escala vai de 0 => 1)
      });

      await MediaLibrary.saveToLibraryAsync(localUri); // Salva a imagem na galeria do dispositivo

      if (localUri) {
        // Caso de certo (A imagem tenha sido capturada)...
        alert("Imagem salva com sucesso!"); // Avisa o usuário de que a imagem foi salva
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Modal style={styles.container} animationType="slide" visible={visible}>
      {/* IMAGEM */}
      <GestureHandlerRootView>
        <GestureDetector gesture={gestures}>
          <SafeAreaView style={styles.container}>
            {/* ÁREA DELIMITADA DA IMAGEM */}
            <View style={styles.areaImage} ref={imageRef}>
              {/* STICKER SELECIONADO */}
              {selectedSticker && <Sticker stickerSource={selectedSticker} />}

              {/* IMAGEM */}
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
          <TouchableOpacity style={styles.buttonModal} onPress={saveImage}>
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
