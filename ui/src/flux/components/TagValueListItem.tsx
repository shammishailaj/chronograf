// Libraries
import React, {PureComponent} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'

// Components
import FieldList from 'src/flux/components/FieldList'

// Utils
import {
  notifyCopyToClipboardSuccess,
  notifyCopyToClipboardFailed,
} from 'src/shared/copy/notifications'

// Constants
import {OpenState} from 'src/flux/constants/explorer'

// types
import {Source, NotificationAction} from 'src/types'
import {ErrorHandling} from 'src/shared/decorators/errors'

interface Props {
  db: string
  source: Source
  searchTerm: string
  tagValue: string
  tagKey: string
  notify: NotificationAction
  measurement: string
}

interface State {
  opened: OpenState
}

@ErrorHandling
class TagValueListItem extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      opened: OpenState.UNOPENED,
    }
  }

  public render() {
    const {db, source, tagValue, tagKey, notify, measurement} = this.props
    const {opened} = this.state
    const isOpen = opened === OpenState.OPENED
    const isUnopen = opened === OpenState.UNOPENED

    const tag = {key: tagKey, value: tagValue}

    return (
      <div
        className={`flux-schema-tree flux-schema--child ${
          isOpen ? 'expanded' : ''
        }`}
        key={tagValue}
        onClick={this.handleItemClick}
      >
        <div className="flux-schema--item">
          <div className="flex-schema-item-group">
            <div className="flux-schema--expander" />
            {tagValue}
            <span className="flux-schema--type">Tag Value</span>
          </div>
          <CopyToClipboard text={tagValue} onCopy={this.handleCopyAttempt}>
            <div className="flux-schema-copy" onClick={this.handleClickCopy}>
              <span className="icon duplicate" title="copy to clipboard" />
              Copy
            </div>
          </CopyToClipboard>
        </div>
        {!isUnopen && (
          <div className={`flux-schema--children ${isOpen ? '' : 'hidden'}`}>
            <FieldList
              db={db}
              source={source}
              tag={tag}
              notify={notify}
              measurement={measurement}
            />
          </div>
        )}
      </div>
    )
  }

  private handleItemClick = (e): void => {
    e.stopPropagation()

    const opened = this.state.opened

    if (opened === OpenState.OPENED) {
      this.setState({opened: OpenState.ClOSED})
      return
    }
    this.setState({opened: OpenState.OPENED})
  }

  private handleClickCopy = (e): void => {
    e.stopPropagation()
  }

  private handleCopyAttempt = (
    copiedText: string,
    isSuccessful: boolean
  ): void => {
    const {notify} = this.props
    if (isSuccessful) {
      notify(notifyCopyToClipboardSuccess(copiedText))
    } else {
      notify(notifyCopyToClipboardFailed(copiedText))
    }
  }
}

export default TagValueListItem
