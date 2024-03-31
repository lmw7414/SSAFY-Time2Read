import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getYearSummary, postGameResult } from '../apis/resultApi.jsx';
import PageMovingButton from '../components/commons/buttons/PageMovingButtons.jsx';
import TopButton from '../components/commons/buttons/TopButton.jsx';
import BodyContainer from '../components/commons/containers/BodyContainer.jsx';
import TranslucentContainer from '../components/commons/containers/TranslucentContainer.jsx';
import WhiteContainerHoverEffect from '../components/commons/containers/WhiteContainerHoverEffect.jsx';
import ResultContent from '../components/commons/ResultContent.jsx';
import ResultTitle from '../components/commons/ResultTitle.jsx';
import { formatTime } from '../components/game/Timer.jsx';
import Articles from '../components/result/article/Articles.jsx';
import Keyword from '../components/result/Keyword.jsx';
import TimeLoader from '../components/result/timeattack/TimeLoader.jsx';
import {
  useGameResultStore,
  useGameModalStore,
  useGameItemStore,
  useVisibilityStore,
  checkCollidedStore,
  checkGameSuccessStore,
  checkGameYearStore,
  useResultDataStore,
} from '../stores/game/gameStore.jsx';
import { useHitsCategoryStore } from '../stores/game/quizStore.jsx';

const ResultPage = () => {
  const navigate = useNavigate();

  console.log('resultPAge 입장');

  const { gameResult } = useGameResultStore(); // 게임 결과 : 정답 수, 오답 수, 타임 어택 시간
  const [keywordData, setKeywordData] = useState([]);
  const topboxRef = useRef(null); // topbox의 ref
  const leftboxRef = useRef(null);
  const rightboxRef = useRef(null);
  const [rightboxWidth, setRightboxWidth] = useState('0px');
  const [rightboxHeight, setRightboxHeight] = useState('0px');
  const [keywordWidth, setKeywordWidth] = useState(0);
  const [keywordHeight, setKeywordHeight] = useState(0);
  const { hitsCategory } = useHitsCategoryStore();
  const { isSucceed, setIsSucceed } = checkGameSuccessStore();
  const gameYear = checkGameYearStore((state) => state.gameYear);
  const setResultData = useResultDataStore((state) => state.setResultData);

  // Json 형식의 파일을 만들어줘야 하는데 왜 자동저장하면 이렇게 되어버리지
  const resultData = {
    isSuccess: isSucceed,
    playYear: gameYear,
    timeAttackTime: gameResult.timeAttackTime,
    solvedCategory: hitsCategory,
  };

  console.log('resultData: ', resultData);

  useEffect(() => {
    getYearSummary(2023)
      .then((data) => {
        setKeywordData(data.result);
        console.log('Year Summary Data:', data.result);
      })
      .catch((error) => {
        console.error('Error requesting year summary:', error);
      });

    if (gameResult.correct === 10) {
      setIsSucceed(true);
    }
  }, []);

  const resetGame = () => {
    useGameModalStore.getState().reset();
    useGameResultStore.getState().reset();
    useGameItemStore.getState().reset();
    useVisibilityStore.getState().reset();
    checkCollidedStore.getState().reset();
    checkGameSuccessStore.getState().reset();
    checkGameYearStore.getState().reset();
    useResultDataStore.getState().reset();
  };

  const navigateToLandingPage = () => {
    resetGame();
    navigate('/');
  };

  const navigateToMyPage = () => {
    const name = sessionStorage.getItem('name');

    if (name !== null) {
      setResultData(resultData);
      postGameResult(resultData);
      navigate('/mypage');
    } else {
      console.log(console.log('로그인 필요'), navigate('/'));
    }
  };

  // 너비 및 높이 동적 조절
  const handleResize = () => {
    requestAnimationFrame(() => {
      if (topboxRef.current && leftboxRef.current && rightboxRef.current) {
        const newWidth = topboxRef.current.offsetWidth / 2; // topbox 너비에 따라 leftbox와 rightbox 너비 조절
        let maxHeight = Math.max(leftboxRef.current.offsetHeight, rightboxRef.current.offsetHeight); // leftbox와 rightbox 높이 비교 후 더 큰 값으로 설정

        setRightboxWidth(`${newWidth}px`);
        setKeywordWidth(newWidth);

        // 창 너비에 따른 높이 조절 로직. 768px 이하일 때 (tailwind에서 md 기준이 768px임) maxHeight가 작아지도록
        if (window.innerWidth < 768) {
          maxHeight /= 2;
        }

        setRightboxHeight(`${maxHeight}px`);
        setKeywordHeight(maxHeight * 0.7);
      }
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize); // 리사이즈 이벤트 리스너 등록

    return () => {
      window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, []);

  return (
    <>
      <TopButton />
      <div className="fixed z-10 flex flex-col gap-6 right-5 top-5">
        <PageMovingButton onClick={navigateToLandingPage} buttonText="다시 시계토끼 쫓아가기" buttonColor="#FBFAEA" />
        <PageMovingButton onClick={navigateToMyPage} buttonText="내 정보 더 자세하게 보기" buttonColor="#FEFEC3" />
      </div>
      <BodyContainer>
        <div className="mb-2 text-xl font-bold text-white">GAME RESULT</div>
        <div className="relative flex flex-col w-full gap-4">
          {/* topbox */}
          <TranslucentContainer>
            <div className="flex flex-col justify-center w-full gap-6 md:flex-row" ref={topboxRef}>
              {/* leftbox */}
              <div className="flex flex-col justify-between gap-6 md:w-2/6" style={{ rightboxWidth }} ref={leftboxRef}>
                {/* 맞은 개수 통계 */}
                <WhiteContainerHoverEffect>
                  <ResultTitle title={'맞은 개수 통계'} />
                  <ResultContent>
                    <div className="flex items-center w-full justify-evenly">
                      총 문제 수 {gameResult.correct + gameResult.incorrect} 개
                    </div>
                    <div>맞은 개수 {gameResult.correct} 개</div>
                    <div>틀린 개수 {gameResult.incorrect} 개</div>
                  </ResultContent>
                </WhiteContainerHoverEffect>

                {/* 타임 어택 시간 */}
                <WhiteContainerHoverEffect>
                  <ResultTitle title={'타임 어택 시간'} />
                  <div className="flex items-center justify-center h-[80%] text-6xl font-bold">
                    {gameResult.timeAttackTime ? (
                      <>
                        <TimeLoader targetNumber={formatTime(600 - gameResult.timeAttackTime)} />
                      </>
                    ) : (
                      <div> 00:00 </div>
                    )}
                  </div>
                  {/* <div> 시간 증가하는 거 테스트 </div>
                  <TimeLoader targetNumber={'03:24'} /> */}
                </WhiteContainerHoverEffect>
              </div>

              {/* rightbox */}
              <div
                className="flex justify-center w-full h-full md:w-4/6 transition-width transition-height"
                style={{ rightboxWidth, rightboxHeight }}
                ref={rightboxRef}
              >
                <WhiteContainerHoverEffect>
                  <ResultTitle title={'키워드'} />
                  <Keyword data={keywordData} width={keywordWidth} height={keywordHeight} />
                </WhiteContainerHoverEffect>
              </div>
            </div>
          </TranslucentContainer>
          <TranslucentContainer>
            <ResultTitle title={'과거와 연결된 기사'} />
            <Articles />
          </TranslucentContainer>
        </div>
      </BodyContainer>
    </>
  );
};

export default ResultPage;
