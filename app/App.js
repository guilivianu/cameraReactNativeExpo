import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import ModalEditImage from "../components/modalEditarFoto";

export default function App() {
  const camRef = useRef(); //Referência câmera

  const [permission, requestPermission] = useCameraPermissions(); // Permissào câmera
  const [facing, setFacing] = useState("front"); // Lado câmera

  const [image, setImage] = useState(); // Foto selecionada/tirada
  const [imageMirror, setImageMirror] = useState(-1); // Imagem espelhada

  const [imageWidth, setImageWidth] = useState(Number); // Largura da foto selecionada/tirada
  const [imageHeight, setImageHeight] = useState(Number); // Altura da foto selecionada/tirada

  const [open, setOpen] = useState(false); // Modal aberto/fechado

  // Permissão câmera
  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    // Caso a permissão ainda não tenha sido aceita...
    return (
      // Tela para pedir permissão a o usuário
      <View>
        <Text style={{ textAlign: "center", color: "#fff" }}>
          Para utilizar a câmera, é necessário obter sua autorização antes.
        </Text>
        <Button onPress={requestPermission} title="Ativar permissão" />
      </View>
    );
  }

  // Pegar imagem da galeria
  const pickImage = async () => {
    // Obs: Não é nescessário nenhuma permissão para abrir a bilbioteca de fotos

    let result = await ImagePicker.launchImageLibraryAsync({
      //Pega a imagem que o usuário selecionou
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Determina o tipo de imagem que será possível selecionar
      quality: 1, // Qualidade que terá a foto selecionada (1 => 100% / mesma qualidade do original)
    });
    setImageMirror(1); // Seta que a imagem não será espelhada

    // console.log(result);

    if (!result.canceled) {
      // Caso a pessoa não tenha cancelado a seleção da imagem na hora de confirmar
      setImage(result.assets[0].uri); // Salva a imagem selecionada
      setImageHeight(result.assets[0].height); // Salva a altura da imagem selecionada
      setImageWidth(result.assets[0].width); // Salva a largura da imagem selecionada

      setOpen(true); // Abre o modal de editar a imagem
    }
  };

  // Tirar foto
  async function takePhoto() {
    setImageMirror(facing === "front" ? -1 : 1); // Caso a foto tirada tenha sida na câmera frontal, espelha a imagem, se for tirada na câmera traseira não espelha a imagem

    if (camRef) {
      const data = await camRef.current.takePictureAsync(); // Tira a foto e salva em "data"
      setImage(data.uri); // Salva a uri na imagem tirada
      setImageHeight(data.height); // Salva a altura na imagem tirada
      setImageWidth(data.width); // Salva a largura na imagem tirada

      setOpen(true); // Abre o modal de editar a imagem
      // console.log(data);
    }
  }

  // Inverter câmera
  function toggleFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* CÂMERA */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={camRef}>
          {/* BOTÕES DA CAMÊRA */}
          <View style={styles.buttonContainer}>
            {/* BOTÃO DE PEGAR IMAGEM DA GALERIA */}
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <FontAwesome size={28} name="image" color={"white"} />
            </TouchableOpacity>

            {/* BOTÃO DE TIRAR FOTO */}
            <TouchableOpacity style={styles.buttonPhoto} onPress={takePhoto}>
              <View style={styles.buttonPhotoInterior} />
            </TouchableOpacity>

            {/* BOTÃO DE INVERTER CAMÊRA */}
            <TouchableOpacity style={styles.button} onPress={toggleFacing}>
              <FontAwesome size={28} name="repeat" color={"white"} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* MODAL */}
      {image && (
        <ModalEditImage
          uri={image}
          visible={open}
          onClose={() => {
            setImage(null);
          }}
          imageMirror={imageMirror}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      )}
    </SafeAreaView>
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

  cameraContainer: {
    // CONTAINER DA CÂMERA
    width: "100%",
    height: "100%",
    borderRadius: 32,
    overflow: "hidden",
  },

  camera: {
    // CÂMERA
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },

  buttonContainer: {
    // CONTAINER DOS BOTÕES
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-around",
    marginVertical: 32,
  },

  button: {
    // BOTÕES LATERAIS
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "black",
    opacity: 0.75,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  buttonPhoto: {
    // BOTÃO DE TIRAR FOTO
    width: 80,
    height: 80,
    borderRadius: 100,
    borderColor: "white",
    borderWidth: 5,

    padding: 8,

    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  buttonPhotoInterior: {
    // INTERIOR DO BOTÃO DE TIRAR FOTO
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 100,
  },
});
