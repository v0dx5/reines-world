/* ===========================================================
   her world — shared data
   Real, lightly-sourced fun facts about each artist & drama.
   Drop a photo into assets/artists/<id>.jpg or assets/dramas/<id>.jpg
   and it will automatically replace the icon everywhere.
=========================================================== */

/* her own photocards — photo lives in assets/her/<id>.jpg */
const HER = [
  { id: 'hair-back', caption: 'hair that is<br>actually<br>unforgettable', pos: 'center 10%' },
  { id: 'pic-01', caption: 'that stare is unfair', pos: '60% 50%' },
  { id: 'pic-02', caption: 'effortlessly stunning', pos: 'center 10%' },
  { id: 'glasses', caption: 'my fav nerd', pos: 'center 5%' },
  { id: 'pic-03', caption: 'that wink is her<br>superpower', pos: '49% 50%' },
  { id: 'pic-05', caption: 'that pout should be illegal', pos: '37% 50%' },
  { id: 'pic-06', caption: 'pretty even<br>in low light', pos: '40% 50%' },
  { id: 'pic-07', caption: 'this face is a whole mood', pos: '61% 50%' },
  { id: 'pic-08', caption: 'the cutest<br>wink ever', pos: '64% 50%' },
];

const ARTISTS = [
  {
    id: 'bruno-mars', name: 'Bruno Mars', icon: 'icon-mic', color: '#fb7199',
    bio: 'Born in Honolulu, Hawaii, and performing on stage since he was a little kid — his dad ran a band and Bruno was doing Elvis impressions by age four.',
    fact: 'His real name is Peter Gene Hernandez — his dad nicknamed him "Bruno" as a kid, and he added "Mars" because he wanted a stage name that sounded out of this world.'
  },
  {
    id: 'stray-kids', name: 'Stray Kids', icon: 'icon-wolf', color: '#60a5fa',
    bio: 'An 8-member group formed through their own JYP survival show — and almost all of them write and produce their own music under the name "3RACHA."',
    fact: 'Their fandom is called STAY, and the 3RACHA trio (Bang Chan, Changbin and Han) has been writing and producing the group\'s songs since before they debuted.'
  },
  {
    id: 'newjeans', name: 'NewJeans', icon: 'icon-bunny', color: '#f9a8d4',
    bio: 'A 5-member group under ADOR, known for their Y2K sound and for blowing up almost instantly after their 2022 debut.',
    fact: 'Their name is a pun — "New" plus "Jeans," meaning something that\'s a timeless classic but still brand new, like a good pair of denim.'
  },
  {
    id: 'enhypen', name: 'ENHYPEN', icon: 'icon-sparkle', color: '#a78bfa',
    bio: 'A 7-member group formed on the survival show "I-LAND," debuting under BELIFT LAB in 2020.',
    fact: 'Their name is built from "Enhypen" as in a hyphen connecting things together — the idea being they connect different values, eras and people through music.'
  },
  {
    id: 'twice', name: 'TWICE', icon: 'icon-candy', color: '#fda4bb',
    bio: 'A 9-member group formed on "Sixteen," debuting in 2015 — one of the longest-running, best-selling girl groups still fully active today.',
    fact: 'Their name means they want to move fans twice — once through the ears, once through the eyes.'
  },
  {
    id: 'blackpink', name: 'BLACKPINK', icon: 'icon-blossom', color: '#ec4899',
    bio: 'A 4-member group under YG Entertainment — Jisoo, Jennie, Rosé and Lisa — who debuted in 2016 and became the best-selling girl group of all time.',
    fact: 'They were the first female K-pop act to headline Coachella, and their YouTube channel was the first girl group channel ever to hit 100 million subscribers.'
  },
  {
    id: 'the-marias', name: 'The Marías', icon: 'icon-feather', color: '#fbcfe8',
    bio: 'An LA indie-pop band formed around singer María Zardoya and drummer Josh Conway, who met at a bar gig and started dating — then started a band.',
    fact: 'The whole band is named after her — María — as a nod to her being the group\'s artistic center. They\'ve since scored Grammy nominations and collaborated with Bad Bunny.'
  },
  {
    id: 'malcolm-todd', name: 'Malcolm Todd', icon: 'icon-guitar', color: '#fdba74',
    bio: 'An indie R&B singer-songwriter from Santa Monica who taught himself guitar on YouTube during lockdown and scooped ice cream for a living while blowing up on TikTok.',
    fact: 'He started singing at age five and grew up on Broadway soundtracks his mom played at home — now he mixes that theater-kid sincerity with lo-fi bedroom R&B.'
  },
  {
    id: 'rose', name: 'ROSÉ', icon: 'icon-rose', color: '#f43f6e',
    bio: 'Born in New Zealand and raised partly in Australia, she\'s one-fourth of BLACKPINK and has built a huge solo career of her own.',
    fact: 'Her solo single "APT." with Bruno Mars became one of the biggest crossover hits of the decade — which makes her and Bruno basically labelmates in this website\'s universe too.'
  },
  {
    id: 'cigarettes-after-sex', name: 'Cigarettes After Sex', icon: 'icon-moon', color: '#8b8b9e',
    bio: 'A dream-pop band fronted by Greg Gonzalez, known for hushed vocals, slow-motion guitars and achingly romantic, almost whispered songs.',
    fact: 'Their breakout song "Apocalypse" blew up years after it was first released, after quietly becoming one of the most streamed "sad late-night" songs on the internet.'
  }
];

const DRAMAS = [
  {
    id: 'when-the-phone-rings', name: 'When the Phone Rings', icon: 'icon-phone',
    color1: 'var(--pink-400)', color2: 'var(--pink-600)', favorite: true,
    synopsis: 'A presidential spokesperson in a loveless marriage of convenience starts getting mysterious phone calls from his "kidnapped" wife — who\'s actually turned the tables on her captor and has his phone.',
    fact: 'It\'s based on a web novel literally titled "The Number You Have Dialed," and stars Yoo Yeon-seok and Chae Soo-bin, who reportedly had such easy chemistry on set that half the BTS clips are just them messing with each other between takes.'
  },
  {
    id: 'all-of-us-are-dead', name: 'All of Us Are Dead', icon: 'icon-ghost',
    color1: '#6b6b8f', color2: '#342f4a', favorite: false,
    synopsis: 'A high school becomes ground zero for a zombie outbreak, and a group of students has to survive both the infected and each other.',
    fact: 'It was filmed in an actual decommissioned high school building in South Korea, which is part of why the hallway chase scenes feel so unsettlingly real.'
  },
  {
    id: 'heads-over-heels', name: 'Heads Over Heels', icon: 'icon-sparkle',
    color1: 'var(--pink-300)', color2: 'var(--pink-500)', favorite: false,
    synopsis: 'A high-school girl secretly moonlights as a shaman known as "Fairy Cheonji," helping strangers with their futures — until a boy she\'s fated to lose shows up as her new transfer student.',
    fact: 'It\'s a modern retelling of the Korean folktale of Gyeon-u and the Weaver Girl — the same legend behind the Chilseok/Qixi "star-crossed lovers" festival.'
  },
  {
    id: 'true-beauty', name: 'True Beauty', icon: 'icon-blossom',
    color1: '#fda4bb', color2: '#f472b6', favorite: false,
    synopsis: 'A girl who hides her bare face behind makeup gets found out by the most popular (and secretly wounded) boy in school — and has to navigate a very messy love triangle from there.',
    fact: 'Based on the hit webtoon of the same name — and yes, the fandom is still split down the middle between Team Suho and Team Seojun.'
  }
];
