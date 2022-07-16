import React, {Component} from 'react'
import PropTypes from 'prop-types'

/*
    THIS CODE IS TAKEN FROM REPO https://github.com/rcdexta/react-trello/blob/master/src/components/Card.js
    NEEDED THIS TO MODIFY THE LAYOUT
    REFACTORED AS FUNCTIONAL COMPONENT
*/

import Tag from 'react-trello/dist/components'
import {
  MovableCardWrapper,
  CardHeader,
//   CardRightContent,
  CardTitle,
  Detail,
  Footer
} from 'react-trello/dist/styles/Base'
// import InlineInput from 'react-trello/dist/widgets/InlineInput'
import DeleteButton from 'react-trello/dist/widgets/DeleteButton'

// const Tag = components.Tag

const KBCard = (props) => {
    const handleOnDelete = (e) => {
        props.onDelete()
        e.stopPropagation()
    }

    const {
        showDeleteButton,
        style,
        tagStyle,
        onClick,
        onDelete,
        onChange,
        className,
        id,
        title,
        label,
        description,
        tags,
        cardDraggable,
        editable,
        t
    } = props

    const updateCard = (card) => {
        onChange({...card, id})
    }

    const titleStyle = {'width': '100%'}

    return (
        <MovableCardWrapper
        data-id={id}
        onClick={onClick}
        style={style}
        className={className}
        >
        <CardHeader>
            <CardTitle draggable={cardDraggable} style={titleStyle}>
                { title }  {/* dont want this editable */ }
            {/* {editable ? <InlineInput 
                        height={'5px'}
                        value={title} border placeholder={t('placeholder.title')} resize='vertical' onSave={(value) => updateCard({title: value})} /> : title} */}
            </CardTitle>
            {/* <CardRightContent>
            {editable ? <InlineInput value={label} border placeholder={t('placeholder.label')} resize='vertical' onSave={(value) => updateCard({label: value})} /> : label}
            </CardRightContent> */}
            {showDeleteButton && <DeleteButton onClick={handleOnDelete} />}
        </CardHeader>
        <Detail>
            { description }
            {/* {editable ? <InlineInput value={description} border placeholder={t('placeholder.description')} resize='vertical' onSave={(value) => updateCard({description: value})} /> : description} */}
        </Detail>
        {tags && tags.length> 0 && (
            <Footer>
            {tags.map(tag => (
                <Tag key={tag.title} {...tag} tagStyle={tagStyle} />
            ))}
            </Footer>
        )}
        </MovableCardWrapper>
    )
}

KBCard.propTypes = {
  showDeleteButton: PropTypes.bool,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  tagStyle: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
}

KBCard.defaultProps = {
  showDeleteButton: true,
  onDelete: () => {},
  onClick: () => {},
  style: {},
  tagStyle: {},
  title: 'no title',
  description: '',
  label: '',
  tags: [],
  className: ''
}

export default KBCard