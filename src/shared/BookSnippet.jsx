import React from 'react'
import get from 'lodash/get'

class BookSnippet extends React.Component {
  render() {
    const { data } = this.props

    const imageLink = get(data, 'volumeInfo.imageLinks.thumbnail')

    return (
      <div>
        {imageLink && (
          <img
            src={imageLink}
            style={{
              float: 'left',
              marginRight: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '5px',
            }}
            alt=""
          />
        )}

        <span
          style={{
            marginTop: 0,
            fontSize: '1.5rem',
            lineHeight: '1.28571429em',
            fontWeight: 700,
          }}
        >
          {get(data, 'volumeInfo.title')}
        </span>

        <p style={{ marginTop: '20px' }}>
          <b>{'description: '}</b>

          {get(data, 'volumeInfo.description')}
        </p>
      </div>
    )
  }
}

export default BookSnippet
