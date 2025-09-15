// Crown stealing sound effects
export const playSwipeSound = () => {
  // Create a synthetic "swipe" sound using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create oscillator for the swipe sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Configure the swipe sound - starts high and quickly drops
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
  
  // Volume envelope - quick attack, sustained decay
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  // Play for 300ms
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

export const playSuccessSound = () => {
  // Create a "success" chime for successful crown steal
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create two-tone success sound
  const playTone = (frequency: number, startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };
  
  // Play two ascending tones
  playTone(523, audioContext.currentTime, 0.2); // C5
  playTone(659, audioContext.currentTime + 0.1, 0.3); // E5
};