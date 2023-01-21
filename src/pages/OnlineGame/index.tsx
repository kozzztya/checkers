import React from 'react';
import { useQuery } from 'react-query';
import { gameService } from '@services/game.service';
import { useParams } from 'react-router-dom';
import { CenteredLoader } from '@components/CenteredLoader';
import { GameModel } from '@services/types';
import { userService } from '@services/user.service';
import { queryClient } from '@src/queryClient';
import { gameHistoryService } from '@services/gameHistory.service';
import { NewUserJoinModal } from './components/NewUserJoinModal';
import { gamePlayerService } from '@services/gamePlayer.service';
import { useSubscription } from '@src/hooks/useSubscription';
import { OnlineGameWithData } from '@pages/OnlineGame/OnlineGameWithData';

export const OnlineGame: React.FC = () => {
  const { gameId } = useParams();

  const { data: game } = useQuery(['games', gameId], () => gameService.get(gameId!), {
    enabled: !!gameId,
  });
  const { data: user, isError: isGetUserError } = useQuery('currentUser', () => userService.getCurrent());
  const { data: gameHistory } = useQuery(['gameHistory', gameId], () => gameHistoryService.getByGameId(gameId!), {
    enabled: !!gameId,
  });
  const { data: inviter } = useQuery(
    ['inviter', gameId],
    () => gamePlayerService.get({ userId: game?.inviterId!, gameId: game?.id! }),
    { enabled: !!game?.inviterId }
  );
  const { data: invitee } = useQuery(
    ['invitee', gameId],
    () => gamePlayerService.get({ userId: game?.inviteeId!, gameId: game?.id! }),
    { enabled: !!game?.inviteeId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(inviter?.id!, (data) => {
        queryClient.setQueryData(['inviter', gameId], data);
      }),
    { enable: inviter?.id && gameId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(invitee?.id!, (data) => {
        queryClient.setQueryData(['invitee', gameId], data);
      }),
    { enable: invitee?.id && gameId }
  );

  useSubscription(
    () =>
      gamePlayerService.onUpdated(invitee?.id!, (data) => {
        queryClient.setQueryData(['invitee', gameId], data);
      }),
    { enable: invitee?.id && gameId }
  );

  useSubscription(
    () =>
      gameHistoryService.onUpdatedByGameId(gameId!, (data) => {
        queryClient.setQueryData(['gameHistory', gameId], data);
      }),
    { enable: gameId }
  );

  useSubscription(
    () =>
      gameService.onUpdate(gameId!, (game: GameModel) => {
        queryClient.setQueryData(['games', gameId], game);
      }),
    { enable: gameId }
  );

  return (
    <>
      <NewUserJoinModal noUser={isGetUserError && !user} game={game} />

      {!game || !user || !gameHistory || !inviter ? (
        <CenteredLoader />
      ) : (
        <OnlineGameWithData game={game} user={user} gameHistory={gameHistory} inviter={inviter} invitee={invitee} />
      )}
    </>
  );
};
