import React, { useCallback, useEffect, useState, memo, useMemo } from 'react'
import { connect } from 'react-redux'
import { Route, withRouter } from 'react-router-dom'
import { actions as userActions, selectors as userSelectors } from 'slices/userSlice'

import { ChannelContainerWrapper } from './styles'
import ChannelList from './components/ChannelList'
import FriendList from './components/FriendList'
import ChannelModal from './components/ChannelModal'

const ChannelContainer = (props) => {
  const {
    channels = [],
    favoriteChannels = [],
    currentChannelId,
    history,
    dispatchCreateChannel,
  } = props

  const [isShowChannelModal, toggleChannelModal] = useState(false)

  const onClickChannel = useCallback((channelId) => {
    if (currentChannelId !== channelId) {
      history.push(`/channels/${channelId}`)
    }
  },
    [currentChannelId]
  )

  const onAddChannel = useCallback(() => {
    toggleChannelModal(state => !state)
  }, [])

  const onCreateChannel = useCallback((name) => {
    dispatchCreateChannel({ name })
    toggleChannelModal(false)
  }, [])

  return (
    <ChannelContainerWrapper>
      <ChannelList
        title="Favorites"
        channels={favoriteChannels}
        onClickChannel={onClickChannel}
        currentChannelId={currentChannelId}
      />
      <ChannelList
        title="Channels"
        channels={channels}
        onAddChannel={onAddChannel}
        onClickChannel={onClickChannel}
        currentChannelId={currentChannelId}
      />
      <FriendList
        title="Members"
      />
      {isShowChannelModal && (
        <ChannelModal
          onCloseModal={onAddChannel}
          onCreateChannel={onCreateChannel}
        />
      )}
    </ChannelContainerWrapper>
  )
}

export default memo(withRouter(connect(
  state => ({
    channels: state.user.channels,
    currentChannelId: state.user.currentChannelId,
    currentChannel: userSelectors.getUserChannel(state),
  }),
  {
    dispatchCreateChannel: userActions.dispatchCreateChannel,
  }
)(ChannelContainer)))
