import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default function Sticker({ stickerSource }) {
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
      scale.value = clamp(startScale.value * event.scale, 0.3, 7.5);
    })
    .runOnJS(true);

  // Alterar posição da Imagem (arrastar)
  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX / scale.value;
    translateY.value += event.changeY / scale.value;
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
      { scale: scale.value },
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
      {
        rotate: `${angle.value}rad`,
      },
    ],
  }));

  return (
    <GestureDetector gesture={gestures}>
      <Animated.Image
        style={[
          {
            top: 350,
            width: 125,
            height: 125,
            objectFit: "contain",
            zIndex: 2,
            position: "absolute",
          },
          boxAnimatedStyles,
        ]}
        source={stickerSource}
      />
    </GestureDetector>
  );
}
