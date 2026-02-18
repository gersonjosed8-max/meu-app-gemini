
// Linguistic Worker for GERGER.GE - Bible Translator
// Author: Gerson Jose De Jesus Selemane

self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === 'SCAN_CONSISTENCY') {
    const { verses, memory } = data;
    const found = [];

    // Simulate intensive linguistic analysis
    for (let i = 0; i < verses.length; i++) {
      const v = verses[i];
      if (!v.translation || v.translation.trim() === '') continue;

      for (let j = 0; j < memory.length; j++) {
        const term = memory[j];
        // Check if Portuguese source contains the critical word
        const sourceMatch = v.original.toLowerCase().includes(term.pt.toLowerCase());
        
        if (sourceMatch) {
          // Verify if Ekoti translation contains the expected term
          const translationMatch = v.translation.toLowerCase().includes(term.koti.toLowerCase());
          
          if (!translationMatch) {
            found.push({
              verseId: v.id,
              ptWord: term.pt,
              usedKoti: "DESVIO_DETECTADO", // Simplified for UI logic
              expectedKoti: term.koti,
              context: v.original,
              location: `Zapuura ${v.chapter}:${v.verse}`
            });
          }
        }
      }
    }

    // Post results back to the main thread
    self.postMessage({ type: 'SCAN_COMPLETE', results: found });
  }
};
