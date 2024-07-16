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
  const [imageMirror, setImageMirror] = useState(Number); // Imagem espelhada
  const [picture, setPicture] = useState(); // Foto selecionada/tirada
  const [open, setOpen] = useState(false); // Modal aberto/fechado

  // Permissão câmera
  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
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
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
      setOpen(true);
      setImageMirror(1);
    }
  };

  // Tirar foto
  async function takePhoto() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setPicture(data.uri);
      setOpen(true);
      setImageMirror(-1);

      console.log(picture);
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
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "white",
                  borderRadius: 100,
                }}
              />
            </TouchableOpacity>

            {/* BOTÃO DE INVERTER CAMÊRA */}
            <TouchableOpacity style={styles.button} onPress={toggleFacing}>
              <FontAwesome size={28} name="repeat" color={"white"} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* MODAL */}
      {picture && (
        <ModalEditImage
          uri={picture}
          visible={open}
          onClose={() => {
            setPicture(null);
          }}
          imageMirror={imageMirror}
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
});
