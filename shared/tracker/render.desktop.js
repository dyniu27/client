// @flow
import React, {PureComponent} from 'react'
import Header from './header.render.desktop'
import Action, {calcFooterHeight} from './action.render.desktop'
import {ModalPositionRelative} from '../common-adapters/relative-popup-hoc.desktop'
import {Box, Avatar, Text, UserProofs, UserBio} from '../common-adapters'
import {globalColors, globalMargins, globalStyles} from '../styles'
import NonUser from './non-user'
import ShowcasedTeamInfo from '../profile/showcased-team-info/container'
import {autoResize} from '../desktop/renderer/remote-component-helper'
import TrackerError from './error'

import type {RenderProps} from './render'

export default class TrackerRender extends PureComponent<RenderProps> {
  componentDidMount() {
    autoResize()
  }

  render() {
    if (this.props.nonUser) {
      return (
        <NonUser
          onClose={this.props.onClose}
          name={this.props.name}
          serviceName={this.props.serviceName}
          reason={this.props.reason}
          inviteLink={this.props.inviteLink}
          isPrivate={this.props.isPrivate}
        />
      )
    }

    if (this.props.error != null) {
      return (
        <div style={styles.container}>
          <TrackerError
            errorMessage={this.props.error.errorMessage}
            onRetry={this.props.error.onRetry}
            onClose={this.props.onClose}
          />
        </div>
      )
    }

    // We have to calculate the height of the footer.
    // It's positioned absolute, so flex won't work here.
    // It's positioned absolute because we want the background transparency.
    // So we use the existing paddingBottom and add the height of the footer
    const footerHeight = calcFooterHeight(this.props.loggedIn)
    const calculatedPadding = styles.content.paddingBottom + footerHeight
    console.warn('showTeamInfo is', this.props.showTeamInfo)
    console.warn('showTeam is', this.props.showTeam)
    console.warn(this.props.showTeam === this.props.teamname)
    const ModalPopupComponent = ModalPositionRelative(ShowcasedTeamInfo)
    return (
      <div style={styles.container}>
        <Header
          reason={this.props.reason}
          onClose={this.props.onClose}
          trackerState={this.props.trackerState}
          currentlyFollowing={this.props.currentlyFollowing}
          loggedIn={this.props.loggedIn}
        />
        <div
          style={{...styles.content, paddingBottom: calculatedPadding}}
          className="hide-scrollbar scroll-container"
        >
          <UserBio
            type="Tracker"
            style={{marginTop: 50}}
            avatarSize={80}
            loading={this.props.loading}
            username={this.props.username}
            userInfo={this.props.userInfo}
            currentlyFollowing={this.props.currentlyFollowing}
            trackerState={this.props.trackerState}
            onClickAvatar={this.props.onClickAvatar}
            onClickFollowers={this.props.onClickFollowers}
            onClickFollowing={this.props.onClickFollowing}
          />
          {this.props.userInfo.showcasedTeams.length > 0 &&
            <Box
              style={{
                ...globalStyles.flexBoxColumn,
                paddingLeft: globalMargins.medium,
                paddingBottom: globalMargins.tiny,
                paddingTop: globalMargins.tiny,
              }}
            >
              {this.props.userInfo.showcasedTeams.map(team => {
                console.warn('team is', team)
                return (
                <Box
                  key={team.fqName}
                  onClick={event => {
                    console.warn('in onClick')
                    const node = event.target instanceof window.HTMLElement ? event.target : null
                    console.warn(node)
                    this.props.onSetShowTeamNode(event.target)
                    this.props.onSetShowTeam(team.fqName)
                  }}
                  style={{
                    ...globalStyles.flexBoxRow,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    minHeight: 24,
                  }}
                >
                  {(this.props.showTeam === team.fqName) && <Box key={team.fqName + 'popup'} style={{zIndex: 50}}>
                      <ModalPopupComponent description={team.description} memberCount={2} openTeam={team.open} publicAdmins={[]} targetNode={this.props.showTeamNode} position="top left" style={{zIndex: 50}} popupNode={<Box />} onClosePopup={() => {
                    this.props.onSetShowTeam(false)
                  }} teamname={team.fqName} />
                  </Box>
                  }
                  <Box
                    style={{
                      ...globalStyles.flexBoxRow,
                      alignItems: 'center',
                      alignSelf: 'center',
                      height: 16,
                      minHeight: 16,
                      minWidth: 16,
                      width: 16,
                    }}
                  >
                    <Avatar teamname={team.fqName} size={16} />
                  </Box>
                  <Box
                    style={{
                      ...globalStyles.flexBoxRow,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      paddingLeft: globalMargins.tiny,
                    }}
                  >
                    <Text style={{color: globalColors.black_75}} type="BodySmallSemiboldInlineLink">
                      {team.fqName}
                    </Text>
                  </Box>
                </Box>
              )})}
            </Box>}
          <UserProofs
            type="proofs"
            style={{
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 8,
              position: 'relative',
              width: 325, // FIXME (mbg): fixed width to line up with existing layout which doesn't take scrollbar into account
            }}
            loadingStyle={{
              left: 24,
              right: 24,
            }}
            username={this.props.username}
            proofs={this.props.proofs}
            loading={this.props.loading}
            currentlyFollowing={this.props.currentlyFollowing}
          />
        </div>
        <div style={styles.footer}>
          {!this.props.loading &&
            this.props.actionBarReady &&
            <Action
              loggedIn={this.props.loggedIn}
              waiting={this.props.waiting}
              state={this.props.trackerState}
              currentlyFollowing={this.props.currentlyFollowing}
              username={this.props.username}
              myUsername={this.props.myUsername}
              lastAction={this.props.lastAction}
              onChat={this.props.onChat}
              onClose={this.props.onClose}
              onIgnore={this.props.onIgnore}
              onFollow={this.props.onFollow}
              onRefollow={this.props.onRefollow}
              onUnfollow={this.props.onUnfollow}
            />}
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    ...globalStyles.flexBoxColumn,
    width: 320,
    height: 470,
    position: 'relative',
  },
  content: {
    overflowY: 'auto',
    overflowX: 'hidden',
    // This value is added to the footer height to set the actual paddingBottom
    paddingBottom: 12,
    zIndex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
}
