import { useEffect, useState } from 'react';
import { PiArrowCounterClockwise } from 'react-icons/pi';
import { useGame } from '../store/game';
import { cn } from '../utils/cn';
import { getActionMessage, getColorButton, getPlayDelay } from '../utils/messages';
import { Direction, GameState, Sides } from '../utils/types';
import { DiceHistory } from './dice';
import { SideComponent } from './side';

export default function Page() {
  const play = useGame((state) => state.play);
  const state = useGame((state) => state.state);
  const reset = useGame((state) => state.reset);
  const rounds = useGame((state) => state.nextRoundCount)();

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(true);

    const timeout = setTimeout(() => {
      setDisabled(false);
    }, getPlayDelay(state));

    return () => clearTimeout(timeout);
  }, [rounds]);

  return (
    <div className='flex flex-col h-screen relative overflow-hidden'>
      <SideComponent side={Sides.Attack} direction={Direction.Up} />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col max-w-full gap-1'>
        <DiceHistory side={Sides.Attack} />

        <div className='flex gap-2 self-center'>
          <button
            type='submit'
            disabled={disabled}
            onClick={play}
            className={cn(
              'text-white px-6 py-3 rounded-full  text-xl font-bold shadow-lg focus:outline-none focus:ring-4 transition-all z-10',
              disabled && 'cursor-not-allowed opacity-50',
              getColorButton(state)
            )}>
            {getActionMessage(state)}
          </button>

          {state === GameState.Rolling && (
            <button
              onClick={reset}
              type='button'
              className='my-auto font-bold text-red-800 rounded-full text-xl flex justify-center items-center hover:text-white transition-all z-10'>
              <PiArrowCounterClockwise size={32} />
            </button>
          )}
        </div>

        <DiceHistory side={Sides.Defense} />
      </div>

      <SideComponent side={Sides.Defense} direction={Direction.Down} />

      <div className='absolute bottom-0 left-full -translate-x-full -translate-y-0 font-semibold p-2 w-full text-yellow-900'>
        Made by{' '}
        <a href='https://arthur.place/' className='hover:underline'>
          Arthur Fiorette
        </a>
      </div>
    </div>
  );
}
