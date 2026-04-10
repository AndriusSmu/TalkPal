document.addEventListener('DOMContentLoaded', () => {
    // Global Soft Bloop Handler
    let audioCtx = null;
    const initAudio = () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    };

    const playBloop = () => {
        try {
            const ctx = initAudio();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        } catch(e) { }
    };

    const playCancelSound = () => {
        try {
            const ctx = initAudio();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2); 
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
            gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        } catch(e) { }
    };

    const playSuccessChime = () => {
        try {
            const ctx = initAudio();
            const freqs = [523.25, 659.25, 783.99]; 
            const startTime = ctx.currentTime;
            
            freqs.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                gain.gain.setValueAtTime(0, startTime + i * 0.1);
                gain.gain.linearRampToValueAtTime(0.3, startTime + i * 0.1 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.5);
                
                osc.start(startTime + i * 0.1);
                osc.stop(startTime + i * 0.1 + 0.5);
            });
        } catch(e) { console.warn('Audio feedback failed', e); }
    };

    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn) {
            if (!btn.classList.contains('cancel-btn') && 
                !btn.classList.contains('send-btn') && 
                !btn.id.includes('skip-feeling-btn') &&
                !btn.classList.contains('sticker-btn')) {
                playBloop();
            }
        }
    });

    // Screens
    const screenIntro = document.getElementById('screen-intro');
    const screenLanding = document.getElementById('screen-landing');
    const screenListenList = document.getElementById('screen-listen-list');
    const screenContacts = document.getElementById('screen-contacts');
    const screenRecord = document.getElementById('screen-record');
    const screenReview = document.getElementById('screen-review');
    const screenListen = document.getElementById('screen-listen');
    const screenStickers = document.getElementById('screen-stickers');
    const screenSentSuccess = document.getElementById('screen-sent-success');

    const screenSafetyOverlay = document.getElementById('screen-safety-overlay');
    const screenSafetySuccess = document.getElementById('screen-safety-success');
    const safetyShieldBtn = document.getElementById('safety-shield-btn');
    const safetyYesBtn = document.getElementById('safety-yes-btn');
    const safetyNoBtn = document.getElementById('safety-no-btn');

    const introBtn = document.getElementById('intro-btn');
    const landingListenBtn = document.getElementById('landing-listen-btn');
    const landingSendBtn = document.getElementById('landing-send-btn');
    const listenListCancelBtn = document.getElementById('listen-list-cancel-btn');
    const contactsCancelBtn = document.getElementById('contacts-cancel-btn');

    const contactBtns = document.querySelectorAll('.contact-btn');
    const listenCardBtns = document.querySelectorAll('#listen-received-grid .listen-card-btn');

    const recordBtn = document.getElementById('record-btn');
    const recordHeader = document.getElementById('record-header');
    const recordCancelBtn = document.getElementById('record-cancel-btn');

    const playBtn = document.getElementById('play-btn');
    const sendBtn = document.getElementById('send-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const audioPlayback = document.getElementById('audio-playback');

    const listenHeader = document.getElementById('listen-header');
    const listenEmoji = document.getElementById('listen-emoji');
    const listenPlayBtn = document.getElementById('listen-play-btn');
    const listenPostActions = document.getElementById('listen-post-actions');
    const listenReplyBtn = document.getElementById('listen-reply-btn');
    const listenStarBtn = document.getElementById('listen-star-btn');
    const listenDoneBtn = document.getElementById('listen-done-btn');
    const listenCancelBtn = document.getElementById('listen-cancel-btn');
    const listenAgainBtn = document.getElementById('listen-again-btn');

    const stickerBtns = document.querySelectorAll('.sticker-btn');
    const skipFeelingBtn = document.getElementById('skip-feeling-btn');
    const goHomeBtn = document.getElementById('go-home-btn');
    const undoBtn = document.getElementById('undo-btn');
    const contactNameSpan = document.getElementById('contact-name');
    const sentHeader = document.getElementById('sent-header');

    const caregiverAdminBtn = document.getElementById('caregiver-admin-btn');
    
    // Core Logic Systems
    let caregiverTimer = null;
    const reportedMessages = []; 
    const dailyStarters = [
        "What was fun today? 🎈",
        "What did you eat for lunch? 🥪",
        "Who made you smile? 😀",
        "Did you listen to music today? 🎵",
        "Are you feeling tired or happy? 🌟"
    ];

    const favoritesGrid = document.getElementById('favorites-grid');
    let favorites = JSON.parse(localStorage.getItem('talkpal_favorites') || '[]');

    const saveFavorites = () => localStorage.setItem('talkpal_favorites', JSON.stringify(favorites));

    let hiddenMessages = JSON.parse(localStorage.getItem('talkpal_hidden') || '[]');
    const saveHiddenMessages = () => localStorage.setItem('talkpal_hidden', JSON.stringify(hiddenMessages));

    const startCaregiverTimer = () => {
        caregiverTimer = setTimeout(() => {
            const pin = prompt("Enter Caregiver PIN:");
            if (pin === "1234") {
                alert("Caregiver Dashboard Unlocked.\n\nBlocked / Reported Logs:\n" + JSON.stringify(reportedMessages));
            }
        }, 3000);
    };

    const cancelCaregiverTimer = () => {
        if (caregiverTimer) {
            clearTimeout(caregiverTimer);
            caregiverTimer = null;
        }
    };

    if (caregiverAdminBtn) {
        caregiverAdminBtn.addEventListener('touchstart', startCaregiverTimer);
        caregiverAdminBtn.addEventListener('mousedown', startCaregiverTimer);
        caregiverAdminBtn.addEventListener('touchend', cancelCaregiverTimer);
        caregiverAdminBtn.addEventListener('mouseup', cancelCaregiverTimer);
        caregiverAdminBtn.addEventListener('mouseleave', cancelCaregiverTimer);
    }

    let currentContact = '';
    let currentListenContact = '';
    let currentListenEmojiId = '';
    let isRecording = false;
    let listenMockHapticId = null;
    let listenMockTimeoutId = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let audioBlobInfo = null;
    let hapticInterval = null;
    let selectedEmotion = null;

    let globalAudioStream = null;
    let undoTimeout = null;
    let fadeTimeout = null;

    let audioAnalyzerCtx = null;
    let microphoneNode = null;
    let analyzerNode = null;
    let dataArray = null;
    let currentRecordingPeak = 0;
    let silenceRafId = null;

    const triggerVibrate = (pattern) => {
        if (navigator.vibrate) navigator.vibrate(pattern);
    };

    const updateDailyStarter = () => {
        const el = document.getElementById('daily-starter');
        if (el) {
            el.textContent = dailyStarters[Math.floor(Math.random() * dailyStarters.length)];
        }
    };

    const showScreen = (screenToShow) => {
        [screenIntro, screenLanding, screenListenList, screenContacts, screenRecord, screenReview, screenListen, screenStickers, screenSentSuccess, screenSafetyOverlay, screenSafetySuccess].forEach(s => {
            if(s) s.classList.add('hidden');
        });
        
        if (screenToShow === screenLanding) {
            updateDailyStarter();
        }
        
        screenToShow.classList.remove('hidden');
    };

    updateDailyStarter();

    const attachSilenceAnalyzer = (stream) => {
        try {
            if (!audioAnalyzerCtx) audioAnalyzerCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioAnalyzerCtx.state === 'suspended') audioAnalyzerCtx.resume();
            
            if (microphoneNode) microphoneNode.disconnect();
            
            microphoneNode = audioAnalyzerCtx.createMediaStreamSource(stream);
            analyzerNode = audioAnalyzerCtx.createAnalyser();
            analyzerNode.fftSize = 256;
            microphoneNode.connect(analyzerNode);
            dataArray = new Uint8Array(analyzerNode.frequencyBinCount);
        } catch (e) { }
    };

    if (safetyShieldBtn) {
        safetyShieldBtn.addEventListener('click', () => {
            triggerVibrate(50);
            if (listenMockHapticId) {
                clearInterval(listenMockHapticId);
                listenEmoji.classList.remove('is-playing');
            }
            if (listenMockTimeoutId) clearTimeout(listenMockTimeoutId);

            showScreen(screenSafetyOverlay);
        });
    }

    if (safetyNoBtn) {
        safetyNoBtn.addEventListener('click', () => {
            triggerVibrate(50);
            showScreen(screenListen);
        });
    }

    if (safetyYesBtn) {
        safetyYesBtn.addEventListener('click', () => {
            playCancelSound(); 
            triggerVibrate([50, 100, 50]);
            
            if (!hiddenMessages.find(h => h.contact === currentListenContact)) {
                hiddenMessages.push({ contact: currentListenContact, emoji: currentListenEmojiId });
                saveHiddenMessages();
                renderHiddenMessages();
            }

            reportedMessages.push({ contact: currentListenContact, time: Date.now() });

            document.querySelectorAll(`.listen-card-btn[data-contact="${currentListenContact}"]`).forEach(node => node.remove());

            currentListenContact = ''; 

            showScreen(screenSafetySuccess);
            setTimeout(() => {
                showScreen(screenLanding);
            }, 2500); 
        });
    }

    if (introBtn) {
        introBtn.addEventListener('click', () => {
            triggerVibrate(50);
            showScreen(screenLanding);
        });
    }

    landingListenBtn.addEventListener('click', () => {
        showScreen(screenListenList);
    });

    landingSendBtn.addEventListener('click', () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !globalAudioStream) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    globalAudioStream = stream;
                    showScreen(screenContacts);
                })
                .catch(err => {
                    console.warn('Microphone error, simulating VM capability:', err);
                    globalAudioStream = null;
                    showScreen(screenContacts);
                });
        } else {
            showScreen(screenContacts);
        }
    });

    listenListCancelBtn.addEventListener('click', () => {
        playCancelSound();
        showScreen(screenLanding);
    });

    contactsCancelBtn.addEventListener('click', () => {
        playCancelSound();
        showScreen(screenLanding);
    });

    contactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triggerVibrate(50);
            currentContact = btn.getAttribute('data-contact');
            
            if (globalAudioStream) {
                mediaRecorder = new MediaRecorder(globalAudioStream);
                mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    audioBlobInfo = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioBlobInfo;
                };
                attachSilenceAnalyzer(globalAudioStream);
            } else {
                mediaRecorder = null; 
            }
            showScreen(screenRecord);
        });
    });

    // Favorites Builder
    const renderFavorites = () => {
        if (!favoritesGrid) return;
        favoritesGrid.innerHTML = '';
        favorites.forEach(fav => {
            const btn = document.createElement('button');
            btn.className = 'listen-card-btn';
            btn.setAttribute('data-contact', fav.contact);
            btn.setAttribute('data-emoji', fav.emoji);
            btn.innerHTML = `<div class="contact-emoji">${fav.emoji}</div><span>${fav.contact} ⭐</span>`;
            
            btn.addEventListener('click', () => {
                triggerVibrate(50);
                currentListenContact = fav.contact;
                currentListenEmojiId = fav.emoji;
                
                listenHeader.textContent = "Listen 🎧";
                listenPlayBtn.classList.remove('hidden');
                listenPostActions.classList.add('hidden');
                listenPostActions.style.display = 'none';

                listenEmoji.textContent = currentListenEmojiId;
                listenEmoji.style.display = 'flex';
                
                showScreen(screenListen);
            });
            favoritesGrid.appendChild(btn);
        });
    };
    renderFavorites(); // Init on Boot

    const renderHiddenMessages = () => {
        const hiddenGrid = document.getElementById('hidden-grid');
        if (!hiddenGrid) return;
        hiddenGrid.innerHTML = '';
        
        hiddenMessages.forEach(msg => {
            document.querySelectorAll(`#listen-received-grid .listen-card-btn[data-contact="${msg.contact}"]`).forEach(node => node.remove());

            const btn = document.createElement('div');
            btn.className = 'listen-card-btn';
            btn.style.opacity = '0.6';
            btn.innerHTML = `<div class="contact-emoji">${msg.emoji}</div><span style="font-size: 24px;">${msg.contact}</span><button class="unhide-btn" style="margin-top: 10px; width: 100%;">Unhide</button>`;
            
            btn.querySelector('.unhide-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                triggerVibrate(50);
                hiddenMessages = hiddenMessages.filter(h => h.contact !== msg.contact);
                saveHiddenMessages();
                renderHiddenMessages();
                
                const recGrid = document.getElementById('listen-received-grid');
                if (recGrid) {
                    const newBtn = document.createElement('button');
                    newBtn.className = 'listen-card-btn';
                    newBtn.setAttribute('data-contact', msg.contact);
                    newBtn.setAttribute('data-emoji', msg.emoji);
                    newBtn.innerHTML = `<div class="contact-emoji">${msg.emoji}</div><span>Listen ${msg.contact}</span>`;
                    
                    newBtn.addEventListener('click', () => {
                        triggerVibrate(50);
                        currentListenContact = newBtn.getAttribute('data-contact');
                        currentListenEmojiId = newBtn.getAttribute('data-emoji');
                        
                        listenHeader.textContent = "Listen 🎧";
                        listenPlayBtn.classList.remove('hidden');
                        listenPostActions.classList.add('hidden');
                        listenPostActions.style.display = 'none';

                        listenEmoji.textContent = currentListenEmojiId;
                        listenEmoji.style.display = 'flex';
                        
                        showScreen(screenListen);
                    });
                    
                    recGrid.appendChild(newBtn);
                }
            });
            hiddenGrid.appendChild(btn);
        });
    };
    renderHiddenMessages();

    listenCardBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triggerVibrate(50);
            currentListenContact = btn.getAttribute('data-contact');
            currentListenEmojiId = btn.getAttribute('data-emoji');
            
            listenHeader.textContent = "Listen 🎧";
            listenPlayBtn.classList.remove('hidden');
            listenPostActions.classList.add('hidden');
            listenPostActions.style.display = 'none';

            listenEmoji.textContent = currentListenEmojiId;
            listenEmoji.style.display = 'flex';
            
            showScreen(screenListen);
        });
    });

    listenPlayBtn.addEventListener('click', () => {
        triggerVibrate(50);
        listenHeader.textContent = `Message from ${currentListenContact} 🔊`;
        
        listenPlayBtn.classList.add('hidden');
        listenEmoji.classList.add('is-playing');
        
        listenMockHapticId = setInterval(() => triggerVibrate([50, 100, 50]), 500);
        
        listenMockTimeoutId = setTimeout(() => {
            listenEmoji.classList.remove('is-playing');
            clearInterval(listenMockHapticId);
            listenHeader.textContent = `Finished 🎧`; 
            
            listenPostActions.style.display = 'grid'; // Maintain grid flow natively
            listenPostActions.classList.remove('hidden');
            
            triggerVibrate([100, 100, 100]);
        }, 4000);
    });

    if (listenStarBtn) {
        listenStarBtn.addEventListener('click', () => {
            playSuccessChime();
            if (!favorites.find(f => f.contact === currentListenContact)) {
                favorites.push({ contact: currentListenContact, emoji: currentListenEmojiId });
                saveFavorites();
                renderFavorites();
            }
            listenStarBtn.textContent = 'Saved! ⭐';
            setTimeout(() => { listenStarBtn.textContent = 'Star ⭐'; }, 2000);
        });
    }

    if (listenAgainBtn) {
        listenAgainBtn.addEventListener('click', () => {
            triggerVibrate(50);
            
            listenPostActions.style.display = 'none';
            listenPostActions.classList.add('hidden');
            
            listenPlayBtn.classList.add('hidden');
            listenHeader.textContent = `Message from ${currentListenContact} 🔊`;
            listenEmoji.classList.add('is-playing');
            listenMockHapticId = setInterval(() => triggerVibrate([50, 100, 50]), 500);
            
            listenMockTimeoutId = setTimeout(() => {
                listenEmoji.classList.remove('is-playing');
                clearInterval(listenMockHapticId);
                listenHeader.textContent = `Finished 🎧`;
                
                listenPostActions.style.display = 'grid';
                listenPostActions.classList.remove('hidden');
                
                triggerVibrate([100, 100, 100]);
            }, 4000);
        });
    }

    listenReplyBtn.addEventListener('click', () => {
        triggerVibrate(50);
        currentContact = currentListenContact;
        
        if (globalAudioStream || (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            if (!globalAudioStream) {
                 navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => { 
                        globalAudioStream = stream;
                        mediaRecorder = new MediaRecorder(globalAudioStream);
                        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
                        mediaRecorder.onstop = () => {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                            audioBlobInfo = URL.createObjectURL(audioBlob);
                            audioPlayback.src = audioBlobInfo;
                        };
                        attachSilenceAnalyzer(globalAudioStream);
                        showScreen(screenRecord);
                    })
                    .catch(err => { mediaRecorder = null; showScreen(screenRecord); });
            } else {
                mediaRecorder = new MediaRecorder(globalAudioStream);
                mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    audioBlobInfo = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioBlobInfo;
                };
                attachSilenceAnalyzer(globalAudioStream);
                showScreen(screenRecord);
            }
        } else {
            mediaRecorder = null;
            showScreen(screenRecord);
        }
    });

    listenDoneBtn.addEventListener('click', () => {
        triggerVibrate(50);
        showScreen(screenLanding);
        
        const cardToRemove = document.querySelector(`#listen-received-grid .listen-card-btn[data-contact="${currentListenContact}"]`);
        if (cardToRemove) cardToRemove.remove();
        
        currentListenContact = '';
        listenStarBtn.textContent = 'Star ⭐';
    });

    listenCancelBtn.addEventListener('click', () => {
        playCancelSound();
        triggerVibrate(50);
        showScreen(screenListenList);
        
        if (listenMockHapticId) clearInterval(listenMockHapticId);
        if (listenMockTimeoutId) clearTimeout(listenMockTimeoutId);
        
        listenEmoji.classList.remove('is-playing');
        currentListenContact = '';
        listenStarBtn.textContent = 'Star ⭐';
    });


    recordCancelBtn.addEventListener('click', () => {
        playCancelSound();
        triggerVibrate(50);
        showScreen(screenContacts);
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
        isRecording = false;
        recordBtn.classList.remove('is-recording-glow');
        recordHeader.textContent = "Tap to Record 🎤";
        if (hapticInterval) clearInterval(hapticInterval);
    });

    recordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerVibrate(50);

        if (!isRecording) {
            isRecording = true;
            audioChunks = [];
            currentRecordingPeak = 0;
            
            if (mediaRecorder && mediaRecorder.state === "inactive") {
                mediaRecorder.start();
                
                const measureSilence = () => {
                    if (!isRecording) return;
                    if (analyzerNode && dataArray) {
                        analyzerNode.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                        let avg = sum / dataArray.length;
                        if (avg > currentRecordingPeak) currentRecordingPeak = avg;
                    } else {
                        currentRecordingPeak = 255;
                    }
                    silenceRafId = requestAnimationFrame(measureSilence);
                };
                if (analyzerNode) measureSilence();
                else currentRecordingPeak = 255;
            } else {
                currentRecordingPeak = 255;
            }
            
            recordBtn.classList.add('is-recording-glow');
            recordHeader.textContent = "Tap to Stop 🛑";
            
            triggerVibrate([50, 100, 50]);
            hapticInterval = setInterval(() => triggerVibrate([50]), 500);
        } else {
            isRecording = false;
            if (silenceRafId) {
                cancelAnimationFrame(silenceRafId);
                silenceRafId = null;
            }
            
            if (currentRecordingPeak <= 10) {
                if (mediaRecorder && mediaRecorder.state === "recording") {
                    mediaRecorder.stop(); 
                }
                recordBtn.classList.remove('is-recording-glow');
                recordHeader.textContent = "I did not hear you. Tap to speak 🎤";
                triggerVibrate([50, 100, 50]);
                clearInterval(hapticInterval);
                
                setTimeout(() => {
                    if (!isRecording) recordHeader.textContent = "Tap to Record 🎤";
                }, 4000);
            } else {
                if (mediaRecorder && mediaRecorder.state === "recording") {
                    mediaRecorder.stop();
                }
                
                recordBtn.classList.remove('is-recording-glow');
                recordHeader.textContent = "Tap to Record 🎤";
                
                clearInterval(hapticInterval);
                triggerVibrate(0);
                
                setTimeout(() => showScreen(screenReview), 200);
            }
        }
    });

    playBtn.addEventListener('click', () => {
        triggerVibrate(50);
        if (audioPlayback.paused) {
            audioPlayback.play().catch(e => console.error(e));
            playBtn.textContent = "Stop 🛑";
        } else {
            audioPlayback.pause();
            audioPlayback.currentTime = 0;
            playBtn.textContent = "Listen ▶️";
        }
    });

    audioPlayback.addEventListener('ended', () => {
        playBtn.textContent = "Listen ▶️";
    });

    cancelBtn.addEventListener('click', () => {
        playCancelSound();
        triggerVibrate(50);
        showScreen(screenContacts); 
        
        audioPlayback.pause();
        audioPlayback.src = "";
        audioChunks = [];
        
        selectedEmotion = null;
    });

    sendBtn.addEventListener('click', () => {
        triggerVibrate(50); 
        playSuccessChime(); 
        audioPlayback.pause();
        
        showScreen(screenStickers);
    });

    const executeFinalSend = () => {
        triggerVibrate([50, 100, 50]);
        playSuccessChime(); 
        
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#4CAF50', '#2196F3', '#FFC107', '#E91E63'] });
        }
        
        contactNameSpan.textContent = currentContact;
        
        undoBtn.classList.remove('fade-out');
        undoBtn.style.display = 'block';
        
        showScreen(screenSentSuccess);
        
        clearTimeout(undoTimeout);
        clearTimeout(fadeTimeout);
        
        undoTimeout = setTimeout(() => {
            undoBtn.classList.add('fade-out');
            fadeTimeout = setTimeout(() => {
                undoBtn.style.display = 'none';
            }, 500); 
        }, 60000);
    };

    stickerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedEmotion = btn.getAttribute('data-emotion');
            executeFinalSend();
        });
    });

    skipFeelingBtn.addEventListener('click', () => {
        selectedEmotion = null;
        executeFinalSend();
    });

    goHomeBtn.addEventListener('click', () => {
        clearTimeout(undoTimeout);
        clearTimeout(fadeTimeout);
        
        audioPlayback.src = "";
        audioChunks = [];
        currentContact = '';
        selectedEmotion = null;
        
        showScreen(screenLanding); 
    });

    undoBtn.addEventListener('click', () => {
        playCancelSound(); 
        triggerVibrate([50, 100, 50]); 
        
        clearTimeout(undoTimeout);
        clearTimeout(fadeTimeout);
        
        audioPlayback.src = "";
        audioChunks = [];
        currentContact = '';
        selectedEmotion = null;
        
        sentHeader.textContent = "Message Canceled ↩️";
        
        setTimeout(() => {
            sentHeader.innerHTML = 'Sent to <span id="contact-name"></span>!';
            showScreen(screenLanding);
        }, 1500);
    });

});
