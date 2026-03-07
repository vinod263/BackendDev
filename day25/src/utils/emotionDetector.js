export function detectEmotion(blendshapes) {

  const getScore = (name) =>
    blendshapes.find(b => b.categoryName === name)?.score || 0;

  const smileLeft = getScore("mouthSmileLeft");
  const smileRight = getScore("mouthSmileRight");
  const frownLeft = getScore("mouthFrownLeft");
  const frownRight = getScore("mouthFrownRight");
  const browInnerUp = getScore("browInnerUp");
  const jawOpen = getScore("jawOpen");

  if (smileLeft > 0.6 && smileRight > 0.6) {
    return "😊 Happy";
  }

  if (frownLeft > 0.5 && frownRight > 0.5 && browInnerUp > 0.4) {
    return "😢 Sad";
  }

  if (jawOpen > 0.6 && browInnerUp > 0.5) {
    return "😲 Surprised";
  }

  return "😐 Neutral";
}