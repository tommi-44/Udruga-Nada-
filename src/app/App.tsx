import { useState, useEffect, useRef } from "react";
import { Heart, Menu, X, ChevronRight, Check, AlertCircle, AlertTriangle, Play, Clock, Target, Sun, Moon, MapPin, Phone, Mail, ExternalLink, ChevronDown, Repeat, Quote, ShieldCheck } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Progress from "@radix-ui/react-progress";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./components/img/ImageWithFallback";

interface Exercise {
  id: number;
  title: string;
  duration: string;
  description: string;
  repetitions: string;
  video?: string;
  youtubeEmbed?: string;
  videoPlaceholder: string;
  instructions: string[];
  image: string;
}

interface CompletedExercises {
  [key: number]: boolean;
}

export default function App() {
  const [activeSection, setActiveSection] = useState("pocetna");
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [showPhaseExercises, setShowPhaseExercises] = useState<{ [key: number]: boolean }>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showYoutubePlayback, setShowYoutubePlayback] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionStep, setQuestionStep] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState({
    timeSinceOperation: "",
    painLevel: "",
    mobilityLevel: "",
    stiffnessLevel: ""
  });
  const [dailyPlanGenerated, setDailyPlanGenerated] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<CompletedExercises>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      const sections = ["pocetna", "faze", "vjezbe", "dnevne-aktivnosti", "podrska", "kontakt"];

      for (const section of sections) {
        const element = sectionsRef.current[section];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  const toggleExerciseCompletion = (exerciseId: number) => {
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  // 8 exercises per phase
  const allExercises: { [key: number]: Exercise[] } = {
    1: [
      {
        id: 101,
        title: "Otvaranje i zatvaranje šake",
        duration: "2 min",
        repetitions: "10-15 ponavljanja",
        description: "Potiče cirkulaciju i smanjuje ukočenost šake i ruke.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=100&end=120&autoplay=1",
        videoPlaceholder: "/images/ruka.png",
        image: "/images/ruka.png",
        instructions: [
          "Ispružite ili poduprite ruku u udobnom položaju",
          "Polako otvorite šaku",
          "Zatim polako zatvorite šaku",
          "Pokret izvodite mirno i bez naglih pokreta",
          "Ponovite 10 do 15 puta"
        ]
      },
      {
        id: 102,
        title: "Kruženje vrata",
        duration: "3 min",
        repetitions: "5 ponavljanja u svaku stranu",
        description: "Pomaže smanjiti napetost u vratu i gornjem dijelu ramena.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=197&end=210&autoplay=1",
        videoPlaceholder: "/images/vrat.png",
        image: "/images/vrat.png",
        instructions: [
          "Sjednite ili stanite uspravno",
          "Opustite ramena",
          "Polako pomičite glavu u laganom kružnom pokretu",
          "Izvodite pokret bez forsiranja",
          "Ponovite 5 puta u svaku stranu"
        ]
      },
      {
        id: 103,
        title: "Kruženje ramenima",
        duration: "3 min",
        repetitions: "5 ponavljanja u svakom smjeru",
        description: "Poboljšava pokretljivost ramena i smanjuje ukočenost.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=282&end=311&autoplay=1",
        videoPlaceholder: "/images/kramen.png",
        image: "/images/kramen.png",
        instructions: [
          "Sjednite ili stanite uspravno",
          "Polako podignite ramena prema ušima",
          "Kružite ramenima prema naprijed",
          "Zatim kružite ramenima prema natrag",
          "Ponovite 5 puta u svakom smjeru"
        ]
      },
      {
        id: 104,
        title: "Podizanje ruke prema naprijed",
        duration: "4 min",
        repetitions: "5-10 ponavljanja",
        description: "Pomaže postupnom vraćanju pokreta ruke prema naprijed.",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=384&end=404&autoplay=1",
        videoPlaceholder: "/images/naprid.png",
        image: "/images/naprid.png",
        instructions: [
          "Stanite ili sjednite uspravno",
          "Ruku polako podižite prema naprijed",
          "Podignite samo do granice ugode",
          "Zadržite kratko",
          "Polako spustite ruku"
        ]
      },
      {
        id: 105,
        title: "Podizanje ruke u stranu",
        duration: "4 min",
        repetitions: "5-10 ponavljanja",
        description: "Pomaže vraćanju pokretljivosti ruke u stranu.",
        video: "https://www.youtube.com/embed/xd36lAM0qP0?start=30&end=90",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=452&end=470&autoplay=1",
        videoPlaceholder: "/images/bok.png",
        image: "/images/bok.png",
        instructions: [
          "Stanite ili sjednite uspravno",
          "Ruku polako podižite u stranu",
          "Ne forsirajte pokret ako osjećate bol",
          "Zadržite kratko u ugodnom položaju",
          "Polako spustite ruku"
        ]
      },
      {
        id: 106,
        title: "Pomicanje ruke prema natrag",
        duration: "4 min",
        repetitions: "5-10 ponavljanja",
        description: "Pomaže postupnom vraćanju pokreta ramena prema natrag.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=530&end=550&autoplay=1",
        videoPlaceholder: "/images/iza.png",
        image: "/images/iza.png",
        instructions: [
          "Stanite uspravno s opuštenim ramenima",
          "Polako pomaknite ruku prema natrag",
          "Pokret neka bude mali i kontroliran",
          "Zadržite kratko",
          "Vratite ruku u početni položaj"
        ]
      },
      {
        id: 107,
        title: "Savijanje lakta",
        duration: "3 min",
        repetitions: "10 ponavljanja",
        description: "Održava pokretljivost lakta i ruke tijekom ranog oporavka.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=667&end=693&autoplay=1",
        videoPlaceholder: "/images/lakat.png",
        image: "/images/lakat.png",
        instructions: [
          "Ispružite ruku ispred sebe ili je poduprite",
          "Polako savijte lakat",
          "Dovedite šaku prema ramenu",
          "Zatim ponovno ispružite ruku",
          "Ponovite 10 puta"
        ]
      },
      {
        id: 108,
        title: "Lagano istezanje i opuštanje ramena",
        duration: "3 min",
        repetitions: "5-10 ponavljanja",
        description: "Završna vježba za opuštanje ramena i smanjenje napetosti.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/61BGYpUQJNk?start=756&end=777&autoplay=1",
        videoPlaceholder: "/images/lagano.png",
        image: "/images/lagano.png",
        instructions: [
          "Sjednite u udoban položaj",
          "Opustite ramena i ruke",
          "Polako udahnite kroz nos",
          "Izdahnite kroz usta",
          "Ponovite nekoliko puta i završite vježbanje mirno"
        ]
      }
    ],
    2: [
      {
        id: 201,
        title: "Potisak laktova prema natrag",
        duration: "4 min",
        repetitions: "5 ponavljanja",
        description: "Pomaže otvoriti prsni koš, poboljšati držanje i povećati pokretljivost ramena.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/P5K8itTPxd4?start=154&end=191&autoplay=1",
        videoPlaceholder: "/images/potisak-laktova-prema-natrag.png",
        image: "/images/potisak-laktova-prema-natrag.png",
        instructions: [
          "Stavite prste iza glave",
          "Laktove usmjerite prema naprijed",
          "Polako povlačite laktove prema natrag",
          "Stisnite lopatice jednu prema drugoj",
          "Zadržite položaj 5 sekundi i vratite se u početni položaj"
        ]
      },
      {
        id: 202,
        title: "Kruženje ramenima",
        duration: "3 min",
        repetitions: "10 kruženja u svakom smjeru",
        description: "Poboljšava pokretljivost ramena i smanjuje ukočenost.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/P5K8itTPxd4?start=195&end=238&autoplay=1",
        videoPlaceholder: "/images/ramena.png",
        image: "/images/ramena.png",
        instructions: [
          "Stanite ili sjednite uspravno",
          "Opustite ramena",
          "Polako kružite ramenima prema natrag",
          "Zatim kružite ramenima prema naprijed",
          "Pokret izvodite polako i kontrolirano"
        ]
      },
      {
        id: 203,
        title: "Penjanje prstima po zidu sprijeda",
        duration: "5 min",
        repetitions: "5–10 ponavljanja",
        description: "Povećava opseg pokreta ruke prema naprijed.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/P5K8itTPxd4?start=240&end=275&autoplay=1",
        videoPlaceholder: "/images/prsti.png",
        image: "/images/prsti.png",
        instructions: [
          "Stanite licem prema zidu",
          "Prstima operirane ruke dodirnite zid",
          "Polako penjite prste prema gore",
          "Zaustavite se kada osjetite istezanje bez boli",
          "Zadržite 10 sekundi ili 3 duboka udaha te polako spustite ruku"
        ]
      },
      {
        id: 204,
        title: "Penjanje prstima po zidu u stranu",
        duration: "5 min",
        repetitions: "5–10 ponavljanja",
        description: "Pomaže vraćanju pokretljivosti ruke u stranu.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/P5K8itTPxd4?start=317&end=342&autoplay=1",
        videoPlaceholder: "/images/pstrana.png",
        image: "/images/pstrana.png",
        instructions: [
          "Stanite bočno uz zid",
          "Operiranu ruku postavite uz zid",
          "Polako penjite prste prema gore",
          "Zaustavite se na granici ugodnog istezanja",
          "Zadržite 10 sekundi ili 3 duboka udaha pa polako spustite ruku"
        ]
      },
      {
        id: 205,
        title: "Podizanje ruku uz štap",
        duration: "6 min",
        repetitions: "8–10 ponavljanja",
        description: "Povećava pokretljivost ramena i prsnog koša.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/P5K8itTPxd4?start=399&end=455&autoplay=1",
        videoPlaceholder: "/images/stap.png",
        image: "/images/stap.png",
        instructions: [
          "Lezite na leđa sa savijenim koljenima",
          "Uzmite štap, metlu ili remen objema rukama",
          "Polako podignite ruke prema stropu",
          "Nastavite pokret prema glavi dok ne osjetite lagano istezanje",
          "Polako vratite ruke u početni položaj"
        ]
      },
      {
        id: 206,
        title: "Penjanje rukom po leđima",
        duration: "5 min",
        repetitions: "5–10 ponavljanja",
        description: "Pomaže vraćanju pokreta potrebnih za svakodnevne aktivnosti poput oblačenja.",
        video: "/videos/videos/duboko-disanje.mp4",
        youtubeEmbed: "https://www.youtube.com/embed/P5K8itTPxd4?start=488&end=502&autoplay=1",
        videoPlaceholder: "/images/leda.png",
        image: "/images/leda.png",
        instructions: [
          "Stanite uspravno",
          "Operiranu ruku postavite iza leđa",
          "Polako klizite rukom prema gore po sredini leđa",
          "Držite lopaticu povučenu prema dolje i natrag",
          "Zadržite 10 sekundi ili 3 duboka udaha te se vratite u početni položaj"
        ]
      }
    ],
    3: [
      {
        id: 301,
        title: "Klizanje uz zid",
        duration: "5 min",
        repetitions: "2 serije po 10 ponavljanja",
        description: "Pomaže vraćanju punog opsega pokreta ramena i poboljšava mobilnost gornjeg dijela tijela.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=222&end=278&autoplay=1",
        videoPlaceholder: "/images/klizanje.png",
        image: "/images/klizanje.png",
        instructions: [
          "Stanite leđima ili licem prema zidu",
          "Oslonite ruke na zid",
          "Polako klizite rukama prema gore",
          "Držite ramena spuštena i opuštena",
          "Vratite se u početni položaj i ponovite"
        ]
      },
      {
        id: 302,
        title: "Veslanje s elastičnom trakom",
        duration: "5 min",
        repetitions: "2 serije po 10–12 ponavljanja",
        description: "Jača mišiće između lopatica i poboljšava držanje tijela.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=321&end=360&autoplay=1",
        videoPlaceholder: "/images/veslanje.png",
        image: "/images/veslanje.png",
        instructions: [
          "Pričvrstite elastičnu traku ispred sebe",
          "Uhvatite krajeve trake objema rukama",
          "Povlačite laktove prema natrag uz tijelo",
          "Stisnite lopatice na kraju pokreta",
          "Polako vratite ruke u početni položaj"
        ]
      },
      {
        id: 303,
        title: "Protrakcija i retrakcija lopatica",
        duration: "6 min",
        repetitions: "2 serije po 10 ponavljanja",
        description: "Poboljšava stabilnost ramena i kontrolu lopatica.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=405&end=425&autoplay=1",
        videoPlaceholder: "/images/lopatica.png",
        image: "/images/lopatica.png",
        instructions: [
          "Zauzmite položaj na koljenima ili plank položaj",
          "Ruke držite potpuno ispružene",
          "Gurajte prsni koš od poda kako bi se lopatice razdvojile",
          "Zatim dopustite lopaticama da se približe jedna drugoj",
          "Tijekom cijele vježbe držite tijelo stabilnim"
        ]
      },
      {
        id: 304,
        title: "Povlačenje lopatica s trakom",
        duration: "5 min",
        repetitions: "2 serije po 10–12 ponavljanja",
        description: "Jača mišiće lopatica i stražnjeg dijela ramena.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=507&end=547&autoplay=1",
        videoPlaceholder: "/images/povlaćenje.png",
        image: "/images/povlaćenje.png",
        instructions: [
          "Uhvatite elastičnu traku objema rukama",
          "Ruke ispružite ispred tijela",
          "Povlačite traku širenjem ruku u stranu",
          "Stisnite lopatice na kraju pokreta",
          "Polako se vratite u početni položaj"
        ]
      },
      {
        id: 305,
        title: "Vanjska rotacija ramena",
        duration: "5 min",
        repetitions: "2 serije po 10 ponavljanja",
        description: "Jača rotatornu manšetu i stabilizira rame.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=565&end=595&autoplay=1",
        videoPlaceholder: "/images/vrot.png",
        image: "/images/vrot.png",
        instructions: [
          "Pričvrstite elastičnu traku sa strane tijela",
          "Savijte lakat pod 90 stupnjeva",
          "Držite lakat uz tijelo",
          "Povlačite podlakticu prema van",
          "Polako se vratite u početni položaj"
        ]
      },
      {
        id: 306,
        title: "Unutarnja rotacija ramena",
        duration: "5 min",
        repetitions: "2 serije po 10 ponavljanja",
        description: "Poboljšava snagu i kontrolu mišića ramena.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=608&end=635&autoplay=1",
        videoPlaceholder: "/images/urot.png",
        image: "/images/urot.png",
        instructions: [
          "Stanite bočno uz pričvršćenu traku",
          "Savijte lakat pod 90 stupnjeva",
          "Držite lakat uz tijelo",
          "Povlačite podlakticu prema trbuhu",
          "Polako se vratite u početni položaj"
        ]
      },
      {
        id: 307,
        title: "Torakalna rotacija",
        duration: "6 min",
        repetitions: "2 serije po 8–10 ponavljanja sa svake strane",
        description: "Povećava pokretljivost prsne kralježnice i aktivaciju lopatica.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=688&end=725&autoplay=1",
        videoPlaceholder: "/images/tork.png",
        image: "/images/tork.png",
        instructions: [
          "Zauzmite položaj na sve četiri",
          "Jednu ruku stavite iza glave",
          "Rotirajte gornji dio tijela prema stropu",
          "Pratite pokret pogledom",
          "Vratite se u početni položaj i ponovite"
        ]
      },
      {
        id: 308,
        title: "Cat camel",
        duration: "5 min",
        repetitions: "2 serije po 10 ponavljanja",
        description: "Poboljšava pokretljivost kralježnice i smanjuje ukočenost.",
        youtubeEmbed: "https://www.youtube.com/embed/-H6pLhuV8Hc?start=775&end=806&autoplay=1",
        videoPlaceholder: "/images/cat.png",
        image: "/images/cat.png",
        instructions: [
          "Zauzmite položaj na sve četiri",
          "Zaokružite leđa prema stropu",
          "Zadržite položaj 5 sekundi",
          "Zatim spustite trbuh i podignite prsni koš",
          "Zadržite 5 sekundi i ponovite"
        ]
      }
    ]
  };

  const questions = [
    {
      question: "Koliko tjedana je prošlo od vaše operacije?",
      options: [
        { label: "0-2 tjedna", value: "phase1" },
        { label: "2-6 tjedana", value: "phase2" },
        { label: "Više od 6 tjedana", value: "phase3" }
      ]
    },
    {
      question: "Koja je vaša razina boli?",
      options: [
        { label: "Bez boli", value: "noPain" },
        { label: "Blaga bol", value: "mildPain" },
        { label: "Umjerena bol", value: "moderatePain" },
        { label: "Jaka bol", value: "highPain" }
      ]
    },
    {
      question: "Kako biste ocijenili pokretljivost ruke?",
      options: [
        { label: "Jako ograničena", value: "limited" },
        { label: "Umjereno ograničena", value: "moderate" },
        { label: "Dobra pokretljivost", value: "good" },
        { label: "Potpuna pokretljivost", value: "full" }
      ]
    },
    {
      question: "Osjećate li ukočenost?",
      options: [
        { label: "Da, jako", value: "stiffYes" },
        { label: "Ponekad", value: "stiffSometimes" },
        { label: "Rijetko", value: "stiffRarely" },
        { label: "Ne", value: "stiffNo" }
      ]
    }
  ];

  const calculateRecommendedPhase = (answers: typeof questionAnswers) => {
    const timePhase = answers.timeSinceOperation === "phase1" ? 1 : answers.timeSinceOperation === "phase2" ? 2 : 3;

    const symptomPhase = (() => {
      if (answers.painLevel === "highPain" || answers.mobilityLevel === "limited" || answers.stiffnessLevel === "stiffYes") {
        return 1;
      }
      if (answers.painLevel === "moderatePain" || answers.mobilityLevel === "moderate" || answers.stiffnessLevel === "stiffSometimes") {
        return 2;
      }
      if ((answers.painLevel === "noPain" || answers.painLevel === "mildPain") &&
          (answers.mobilityLevel === "good" || answers.mobilityLevel === "full") &&
          (answers.stiffnessLevel === "stiffRarely" || answers.stiffnessLevel === "stiffNo")) {
        return 3;
      }
      return 2;
    })();

    return Math.min(timePhase, symptomPhase);
  };

  const handleQuestionAnswer = (value: string) => {
    const nextAnswers = { ...questionAnswers };

    if (questionStep === 0) {
      nextAnswers.timeSinceOperation = value;
    } else if (questionStep === 1) {
      nextAnswers.painLevel = value;
    } else if (questionStep === 2) {
      nextAnswers.mobilityLevel = value;
    } else if (questionStep === 3) {
      nextAnswers.stiffnessLevel = value;
    }

    setQuestionAnswers(nextAnswers);

    if (questionStep < questions.length - 1) {
      setTimeout(() => setQuestionStep(prev => prev + 1), 300);
    } else {
      const recommendedPhase = calculateRecommendedPhase(nextAnswers);
      setTimeout(() => {
        setSelectedPhase(recommendedPhase);
        setShowQuestionnaire(false);
        setDailyPlanGenerated(true);
        scrollToSection("dnevne-aktivnosti");
      }, 300);
    }
  };

  const morningExercises = allExercises[selectedPhase].slice(0, 4);
  const eveningExercises = allExercises[selectedPhase].slice(4, 8);

  const calculateProgress = (exercises: Exercise[]) => {
    const completed = exercises.filter(ex => completedExercises[ex.id]).length;
    return Math.round((completed / exercises.length) * 100);
  };

  const parseDuration = (dur: string) => parseInt(dur) || 0;
  const allDailyExercises = [...morningExercises, ...eveningExercises];
  const dailyProgress = calculateProgress(allDailyExercises);
  const totalMinutes = allDailyExercises.reduce((sum, ex) => sum + parseDuration(ex.duration), 0);

  const navItems = [
    { id: "pocetna", label: "Početna" },
    { id: "faze", label: "Faze oporavka" },
    { id: "vjezbe", label: "Vježbe" },
    { id: "dnevne-aktivnosti", label: "Dnevne aktivnosti" },
    { id: "podrska", label: "Podrška" },
    { id: "kontakt", label: "Kontakt" }
  ];

  const remainingCount = allExercises[selectedPhase].length - 3;
  const displayedRemainingCount = remainingCount + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection("pocetna")}
            >
              <Heart className="w-6 h-6 text-primary fill-primary" />
              <span className="font-medium text-lg">Udruga Nada</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm transition-colors relative py-2 ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section
        ref={(el) => (sectionsRef.current["pocetna"] = el)}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f8] via-[#fce7e7] to-[#f5e6e6] pt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl mb-6 leading-tight">
                Vaš put do<br />
                potpunog oporavka
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Dobrodošli u vaš osobni vodič kroz oporavak nakon operacije dojke.
                Ovdje ćete pronaći vježbe, savjete i podršku prilagođenu vašim
                potrebama - korak po korak, dan po dan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection("faze")}
                  className="group px-8 py-4 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Započni
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowQuestionnaire(true);
                    setQuestionStep(0);
                    setQuestionAnswers({
                      timeSinceOperation: "",
                      painLevel: "",
                      mobilityLevel: "",
                      stiffnessLevel: ""
                    });
                    setDailyPlanGenerated(false);
                  }}
                  className="px-8 py-4 bg-white text-foreground rounded-full hover:bg-gray-50 transition-all border border-border flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Kreiraj dnevni plan
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1536914356815-690cf1fa40e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Oporavak s podrškom"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--success)] flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <p className="font-medium">Sigurno i s podrškom</p>
                    <p className="text-sm text-muted-foreground">Dan po dan</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-primary" />
        </motion.div>
      </section>

      {/* Faze Oporavka Section */}
      <section
        ref={(el) => (sectionsRef.current["faze"] = el)}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Faze oporavka</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Vaš oporavak podijeljen je u tri ključne faze. Odaberite fazu u
              kojoj se trenutno nalazite.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                phase: 1,
                title: "Rana faza",
                period: "0-2 tjedna",
                color: "var(--phase-1)",
                focus: "Odmor i blagi pokreti"
              },
              {
                phase: 2,
                title: "Aktivna faza",
                period: "2-6 tjedana",
                color: "var(--phase-2)",
                focus: "Povećanje raspona pokreta"
              },
              {
                phase: 3,
                title: "Povratak aktivnosti",
                period: "6+ tjedana",
                color: "var(--phase-3)",
                focus: "Jačanje i funkcionalnost"
              }
            ].map((item) => (
              <motion.div
                key={item.phase}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPhase(item.phase);
                  scrollToSection("vjezbe");
                }}
                className={`cursor-pointer rounded-3xl p-8 border-2 transition-all ${
                  selectedPhase === item.phase
                    ? "border-primary shadow-xl"
                    : "border-border hover:border-primary/50 shadow-md"
                }`}
                style={{ backgroundColor: item.color }}
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-2xl font-medium text-primary">{item.phase}</span>
                </div>
                <h3 className="text-2xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.period}</p>
                <p className="text-sm">{item.focus}</p>
                {selectedPhase === item.phase && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 flex items-center gap-2 text-primary"
                  >
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Odabrano</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vježbe Section - NEW LOGIC */}
      <section
        ref={(el) => (sectionsRef.current["vjezbe"] = el)}
        className="py-20 bg-muted"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Vježbe za vašu fazu</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Prilagođene vježbe za fazu {selectedPhase} - ukupno {allExercises[selectedPhase].length} vježbi
            </p>
          </motion.div>

          {/* First 2 exercises + highlighted 3rd card */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Exercise 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ delay: 0 }}
              onClick={() => setSelectedExercise(allExercises[selectedPhase][0])}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={allExercises[selectedPhase][0].image}
                  alt={allExercises[selectedPhase][0].title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{allExercises[selectedPhase][0].duration}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2">{allExercises[selectedPhase][0].title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{allExercises[selectedPhase][0].description}</p>
                <div className="flex items-center gap-2 text-primary hover:gap-3 transition-all">
                  <span className="text-sm font-medium">Pogledaj detalje</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Exercise 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedExercise(allExercises[selectedPhase][1])}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={allExercises[selectedPhase][1].image}
                  alt={allExercises[selectedPhase][1].title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{allExercises[selectedPhase][1].duration}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2">{allExercises[selectedPhase][1].title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{allExercises[selectedPhase][1].description}</p>
                <div className="flex items-center gap-2 text-primary hover:gap-3 transition-all">
                  <span className="text-sm font-medium">Pogledaj detalje</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>

            {/* Highlighted "+X vježbi" card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: 0.2 }}
              onClick={() => setShowPhaseExercises(prev => ({ ...prev, [selectedPhase]: !prev[selectedPhase] }))}
              className="relative bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary transition-all cursor-pointer flex items-center justify-center min-h-[400px] shadow-md hover:shadow-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTIsIDE2NSwgMTY1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
              <div className="text-center p-8 relative z-10">
                <motion.div
                  animate={{
                    rotate: showPhaseExercises[selectedPhase] ? 180 : 0,
                    scale: showPhaseExercises[selectedPhase] ? 0.9 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  {showPhaseExercises[selectedPhase] ? (
                    <ChevronDown className="w-10 h-10 text-white" />
                  ) : (
                    <span className="text-3xl font-medium text-white">+{displayedRemainingCount}</span>
                  )}
                </motion.div>
                <h3 className="text-2xl mb-3 text-primary">
                  {showPhaseExercises[selectedPhase] ? "Sakrij dodatne vježbe" : `+${displayedRemainingCount} vježbi`}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {showPhaseExercises[selectedPhase]
                    ? "Kliknite za zatvaranje"
                    : `Otkrijte sve vježbe za fazu ${selectedPhase}`}
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                  {showPhaseExercises[selectedPhase] ? "Zatvori" : "Prikaži sve"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showPhaseExercises[selectedPhase] ? "rotate-180" : ""}`} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Expanded exercises */}
          <AnimatePresence>
            {showPhaseExercises[selectedPhase] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid md:grid-cols-3 gap-6 pt-6"
                >
                  {allExercises[selectedPhase].slice(2).map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedExercise(exercise)}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={exercise.image}
                          alt={exercise.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium">{exercise.duration}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg mb-2">{exercise.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                        <div className="flex items-center gap-2 text-primary hover:gap-3 transition-all">
                          <span className="text-sm font-medium">Pogledaj detalje</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Dnevne Aktivnosti Section */}
      <section
        ref={(el) => (sectionsRef.current["dnevne-aktivnosti"] = el)}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Vaš dnevni plan</h2>
            {dailyPlanGenerated && (
              <p className="text-sm font-semibold text-primary mb-3">Preporučena faza: Faza {selectedPhase}</p>
            )}
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {dailyPlanGenerated
                ? "Prilagođeni plan vježbi za jutro i večer"
                : "Kreirajte personalizirani plan odgovaranjem na kratki upitnik"}
            </p>
          </motion.div>

          {!dailyPlanGenerated ? (
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-muted to-muted/50 rounded-3xl p-12 shadow-lg"
              >
                <Target className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl mb-4">Kreirajte svoj dnevni plan</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Odgovorite na nekoliko pitanja i dobijte personalizirani plan
                  vježbi prilagođen vašoj trenutnoj fazi oporavka.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowQuestionnaire(true);
                    setQuestionStep(0);
                    setQuestionAnswers({
                      timeSinceOperation: "",
                      painLevel: "",
                      mobilityLevel: "",
                      stiffnessLevel: ""
                    });
                    setDailyPlanGenerated(false);
                  }}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-lg inline-flex items-center gap-2"
                >
                  Započni upitnik
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-rose-100 via-rose-200/80 to-rose-100 border border-rose-200/80 rounded-3xl p-6 md:p-8 shadow-sm"
              >
                <div className="mb-6">
                  <h2 className="text-3xl mb-1">Današnje vježbe</h2>
                  <p className="text-sm text-muted-foreground">Preporučeno za vas danas</p>
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-sm text-foreground/60 whitespace-nowrap">Napredak:</span>
                  <Progress.Root className="flex-1 h-2.5 bg-white/70 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dailyProgress}%` }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="h-full bg-primary rounded-full"
                    >
                      <Progress.Indicator className="h-full" style={{ width: "100%" }} />
                    </motion.div>
                  </Progress.Root>
                  <span className="text-sm font-semibold text-primary w-10 text-right">{dailyProgress}%</span>
                </div>
                {/* Morning Exercises */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-xl">Jutarnje vježbe</h3>
                      <p className="text-xs text-muted-foreground">Započnite dan s blagim pokretima</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {morningExercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                      >
                        <div
                          className="relative h-36 overflow-hidden cursor-pointer"
                          onClick={() => setSelectedExercise(exercise)}
                        >
                          <ImageWithFallback
                            src={exercise.image}
                            alt={exercise.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3.5">
                          <h4 className="text-sm font-semibold mb-2 line-clamp-1">{exercise.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {exercise.duration}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleExerciseCompletion(exercise.id)}
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                completedExercises[exercise.id]
                                  ? "bg-primary border-primary text-white shadow-sm"
                                  : "border-gray-300 hover:border-primary/60"
                              }`}
                            >
                              {completedExercises[exercise.id] && <Check className="w-3.5 h-3.5" />}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Evening Exercises */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl">Večernje vježbe</h3>
                      <p className="text-xs text-muted-foreground">Opustite se i održite mobilnost</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {eveningExercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                      >
                        <div
                          className="relative h-36 overflow-hidden cursor-pointer"
                          onClick={() => setSelectedExercise(exercise)}
                        >
                          <ImageWithFallback
                            src={exercise.image}
                            alt={exercise.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3.5">
                          <h4 className="text-sm font-semibold mb-2 line-clamp-1">{exercise.title}</h4>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {exercise.duration}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleExerciseCompletion(exercise.id)}
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                completedExercises[exercise.id]
                                  ? "bg-primary border-primary text-white shadow-sm"
                                  : "border-gray-300 hover:border-primary/60"
                              }`}
                            >
                              {completedExercises[exercise.id] && <Check className="w-3.5 h-3.5" />}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Podrška Section - REDESIGNED */}
      <section
        ref={(el) => (sectionsRef.current["podrska"] = el)}
        className="py-20 bg-gradient-to-br from-[var(--phase-1)] to-[var(--phase-2)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Podrška i inspiracija</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Niste same. Ovdje su priče i resursi koji vam mogu pomoći.
            </p>
          </motion.div>

          {/* Iskustva korisnica - Testimonials */}
          <div className="mb-16">
            <h3 className="text-3xl mb-8 text-center">Iskustva korisnica</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="p-8">
                  <Quote className="w-10 h-10 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "Nakon operacije, osjećala sam se izgubljeno. Ali zahvaljujući podršci
                    Udruge Nada i strukturiranim vježbama, shvatila sam da svaki mali korak
                    znači napredak. Danas, šest mjeseci kasnije, vratila sam se svim
                    aktivnostima koje volim."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1536914356815-690cf1fa40e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                        alt="Marija"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Marija K.</p>
                      <p className="text-sm text-muted-foreground">8 mjeseci nakon operacije</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="p-8">
                  <Quote className="w-10 h-10 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "Vježbe su mi pomogle ne samo fizički, već i mentalno. Osjećaj kontrole
                    nad vlastitim oporavkom dao mi je snagu. Grupa podrške bila je ključna -
                    razgovor s ženama koje razumiju što prolazim bio je neprocjenjiv."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1595392599406-88100147f91c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                        alt="Ana"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Ana M.</p>
                      <p className="text-sm text-muted-foreground">1 godina nakon operacije</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Korisni resursi - Resources */}
          <div>
            <h3 className="text-3xl mb-8 text-center">Korisni resursi</h3>
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Udruga Nada - with contact info */}
              <motion.a
                href="mailto:klub.nada.rijeka@gmail.com"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all flex items-start gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold mb-0.5">Udruga Nada</h4>
                  <p className="text-sm text-blue-700 leading-snug mb-3">Podrška zajednica i programi za žene tijekom oporavka.</p>
                </div>
                <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              </motion.a>

              {/* HZZO */}
              <motion.a
                href="https://www.hzzo.hr"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold mb-0.5">HZZO</h4>
                  <p className="text-sm text-blue-700 leading-snug">Informacije o pravima, rehabilitaciji i zdravstvenom osiguranju.</p>
                </div>
                <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              </motion.a>

              {/* WHO */}
              <motion.a
                href="https://www.who.int"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold mb-0.5">WHO</h4>
                  <p className="text-sm text-blue-700 leading-snug">Smjernice Svjetske zdravstvene organizacije za oporavak i dobrobit.</p>
                </div>
                <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              </motion.a>

              {/* KBC Rijeka */}
              <motion.a
                href="https://www.kbc-rijeka.hr"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold mb-0.5">KBC Rijeka</h4>
                  <p className="text-sm text-blue-700 leading-snug">Klinika za onkologiju i rehabilitaciju u vašoj regiji.</p>
                </div>
                <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt Section - SIMPLIFIED */}
      <section
        ref={(el) => (sectionsRef.current["kontakt"] = el)}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4">Kontaktirajte nas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Tu smo za vas. Javite nam se s bilo kakvim pitanjima.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-primary fill-primary" />
                  <h3 className="text-2xl">Udruga Nada</h3>
                </div>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Neprofitna organizacija posvećena podršci ženama u oporavku
                  nakon operacija dojke.
                </p>

                <div className="space-y-5">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Adresa</p>
                      <p className="text-sm text-muted-foreground">
                        Milana Smokvine Tvrdog 5/1<br />
                        51 000 Rijeka
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Telefon</p>
                      <p className="text-sm text-muted-foreground">051 371 062</p>
                      <p className="text-sm text-muted-foreground">097 613 9715</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">klub.nada.rijeka@gmail.com</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-xl h-[600px] border-4 border-white"
            >
              <iframe
                src="https://maps.google.com/maps?q=Milana%20Smokvine%20Tvrdog%205%2F1%2C%2051000%20Rijeka&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokacija Udruge Nada"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => scrollToSection("pocetna")}
            >
              <Heart className="w-6 h-6 text-primary fill-primary" />
              <span className="font-medium">Udruga Nada</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-relaxed">
                Ovaj sadržaj služi isključivo u informativne svrhe. Prije početka bilo kakvih vježbi razgovarajte sa svojim liječnikom ili fizioterapeutom.
              </p>
            </div>
          </motion.div>

          <div className="text-center text-sm text-muted-foreground">
            <p>© Udruga Nada. Sva prava pridržana.</p>
          </div>
        </div>
      </footer>

      {/* Questionnaire Dialog */}
      <Dialog.Root open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-2xl mb-2">Personalizirajte svoj plan</Dialog.Title>
            <p className="text-muted-foreground mb-6">
              Pitanje {questionStep + 1} od {questions.length}
            </p>

            <div className="mb-6">
              <Progress.Root className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((questionStep + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-primary"
                >
                  <Progress.Indicator className="h-full" style={{ width: "100%" }} />
                </motion.div>
              </Progress.Root>
            </div>

            <div className="mb-8">
              <h3 className="text-xl mb-6">{questions[questionStep].question}</h3>
              <div className="space-y-3">
                {questions[questionStep].options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuestionAnswer(option.value)}
                    className="w-full p-4 text-left bg-muted hover:bg-primary/10 rounded-xl transition-all border-2 border-transparent hover:border-primary"
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Exercise Detail Dialog */}
      <Dialog.Root
        open={!!selectedExercise}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedExercise(null);
            setShowYoutubePlayback(false);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[95vh] bg-white rounded-3xl overflow-hidden shadow-2xl md:max-h-[90vh] overflow-y-auto">
            {selectedExercise && (
              <>
                <div className="relative h-80 overflow-hidden bg-black">
                  {showYoutubePlayback && selectedExercise.youtubeEmbed ? (
                    <iframe
                      src={selectedExercise.youtubeEmbed}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : selectedExercise.youtubeEmbed ? (
                    <>
                      <ImageWithFallback
                        src={selectedExercise.videoPlaceholder}
                        alt={selectedExercise.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (selectedExercise.youtubeEmbed) {
                              setShowYoutubePlayback(true);
                            }
                          }}
                          className="w-20 h-20 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition-all shadow-xl"
                        >
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </motion.button>
                      </div>
                    </>
                  ) : selectedExercise.video ? (
                    <video
                      src={selectedExercise.video}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                  ) : (
                    <>
                      <ImageWithFallback
                        src={selectedExercise.videoPlaceholder}
                        alt={selectedExercise.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (selectedExercise.youtubeEmbed) {
                              setShowYoutubePlayback(true);
                            }
                          }}
                          className="w-20 h-20 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition-all shadow-xl"
                        >
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </motion.button>
                      </div>
                    </>
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{selectedExercise.duration}</span>
                  </div>
                </div>

                <div className="p-8">
                  <Dialog.Title className="text-3xl mb-3">{selectedExercise.title}</Dialog.Title>
                  <p className="text-muted-foreground mb-2 text-lg">{selectedExercise.description}</p>

                  <div className="flex items-center gap-2 mb-6 text-primary">
                    <Repeat className="w-5 h-5" />
                    <span className="font-medium">{selectedExercise.repetitions}</span>
                  </div>

                  <div className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl p-6 mb-6">
                    <h4 className="mb-4 flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-primary" />
                      Upute za izvođenje
                    </h4>
                    <ol className="space-y-3">
                      {selectedExercise.instructions.map((instruction, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm pt-1">{instruction}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Ako osjetite bol ili nelagodu tijekom izvođenja vježbe, odmah se zaustavite
                        i kontaktirajte svog liječnika ili fizioterapeuta.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        toggleExerciseCompletion(selectedExercise.id);
                        setSelectedExercise(null);
                      }}
                      className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg shadow-lg"
                    >
                      <Check className="w-5 h-5" />
                      Označi kao završeno
                    </motion.button>
                    <Dialog.Close asChild>
                      <button className="px-6 py-4 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors">
                        Zatvori
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition-all shadow-lg">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
