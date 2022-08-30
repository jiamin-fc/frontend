import {
  Tag,
  Tr,
  Td,
  Switch,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { TWatchlistItem } from 'types/client/account';

import TableItemActionButtons from 'ui/shared/TableItemActionButtons';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: TWatchlistItem;
  onEditClick: (data: TWatchlistItem) => void;
  onDeleteClick: (data: TWatchlistItem) => void;
}

const WatchlistTableItem = ({ item, onEditClick, onDeleteClick }: Props) => {
  const [ notificationEnabled, setNotificationEnabled ] = useState(item.notification_methods.email);
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const { mutate } = useMutation(() => {
    const data = { ...item, notification_methods: { email: !notificationEnabled } };
    return fetch(`/api/account/watchlist/${ item.id }`, { method: 'PUT', body: JSON.stringify(data) });
  }, {
    onError: () => {
      // eslint-disable-next-line no-console
      console.log('error');
    },
    onSuccess: () => {
      setNotificationEnabled(prevState => !prevState);
    },
  });

  const onSwitch = useCallback(() => {
    return mutate();
  }, [ mutate ]);

  return (
    <Tr alignItems="top" key={ item.address_hash }>
      <Td><WatchListAddressItem item={ item }/></Td>
      <Td>
        <TruncatedTextTooltip label={ item.name }>
          <Tag variant="gray" lineHeight="24px">
            { item.name }
          </Tag>
        </TruncatedTextTooltip>
      </Td>
      <Td><Switch colorScheme="blue" size="md" isChecked={ notificationEnabled } onChange={ onSwitch }/></Td>
      <Td>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick }/>
      </Td>
    </Tr>
  );
};

export default WatchlistTableItem;
