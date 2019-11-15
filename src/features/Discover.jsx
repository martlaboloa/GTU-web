import React from 'react'
import get from 'lodash/get'
import { Input, Grid, Container, Divider, Pagination, Rail, Button, Popup } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { toast } from 'react-semantic-toasts'
import webAPIProvider from '../webAPIProvider'
import BookSnippet from '../shared/BookSnippet'
import actions from '../store/categories/actions'

class Discover extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchText: 'Harry Potter',
      previouslySearchedText: '',
      searchResult: this.getDefaultSearchResult(),

      activePage: 1,
      maxItemsPerPage: 8,
    }

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.handleSearchClick = this.handleSearchClick.bind(this)
    this.handlePaginationChange = this.handlePaginationChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleAddToSaved = this.handleAddToSaved.bind(this)
    this.handleAddToFavourites = this.handleAddToFavourites.bind(this)
  }

  getDefaultSearchResult() {
    return {
      items: [],
      totalItems: 0,
    }
  }

  computeTotalPages() {
    const { searchResult: { totalItems }, maxItemsPerPage } = this.state

    return Math.ceil(totalItems / maxItemsPerPage)
  }

  computeStartIndex(activePage) {
    const { maxItemsPerPage } = this.state

    return maxItemsPerPage * (activePage - 1)
  }

  handleSearchInputChange(_, { value }) {
    this.setState({ searchText: value })
  }

  searchResultToSavable({ items = [], totalItems }) {
    return { items, totalItems }
  }

  handleSearchClick() {
    const { searchText, maxItemsPerPage } = this.state

    const newActivePage = 1

    if (searchText) {
      this.setState({
        searchResult: this.getDefaultSearchResult(),
        previouslySearchedText: searchText,
        activePage: newActivePage,
      })

      this.props.webAPI.googleBooks.queryVolumes({
        pendingName: 'searchPending',
        queryString: searchText,
        maxResults: maxItemsPerPage,
        startIndex: this.computeStartIndex(newActivePage),
      }).then(response => {
        this.setState({ searchResult: this.searchResultToSavable(response) })
      })
    }
  }

  handleKeyPress(e) {
    if (e.charCode === 13) {
      this.handleSearchClick()
    }
  }

  handlePaginationChange(e, { activePage }) {
    const { previouslySearchedText, maxItemsPerPage } = this.state

    this.props.webAPI.googleBooks.queryVolumes({
      pendingName: 'paginationPending',
      queryString: previouslySearchedText,
      maxResults: maxItemsPerPage,
      startIndex: this.computeStartIndex(activePage),
    }).then(
      response => {
        this.setState({
          searchResult: this.searchResultToSavable(response),
          activePage,
        })
      },
      ({ error: { code, message } }) => {
        if (code === 400) {
          toast({
            title: 'Page is not there.',
            description: <p>google API is not consistent sometimes, due to this some pages might not be available.</p>,
            time: 6000,
            icon: 'warning circle',
          })
        } else {
          toast({
            title: 'Goole API error.',
            description: <p>{message}</p>,
            time: 6000,
            icon: 'warning circle',
          })
        }
      },
    )
  }

  listPagination() {
    const { searchResult: { totalItems }, activePage } = this.state

    return (
      <Pagination
        firstItem={null}
        lastItem={null}
        secondary
        totalPages={totalItems}
        floated="right"
        activePage={activePage}
        onPageChange={this.handlePaginationChange}
      />
    )
  }

  handleAddToSaved({ id, volumeInfo }) {
    return () => {
      this.props.addToSaved(id)

      toast({
        title: 'Added to Saved',
        description: get(volumeInfo, 'title'),
        time: 6000,
        icon: 'check',
        color: 'green',
      })
    }
  }

  handleAddToFavourites({ id, volumeInfo }) {
    return () => {
      this.props.addToFavourites(id)

      toast({
        title: 'Added to Favourites',
        description: get(volumeInfo, 'title'),
        time: 6000,
        icon: 'check',
        color: 'green',
      })
    }
  }

  render() {
    const {
      webAPIPending: {
        googleBooksPending: { searchPending, paginationPending },
      },
    } = this.props
    const { searchText, searchResult, previouslySearchedText } = this.state

    return (
      <React.Fragment>
        <Container>
          <Grid
            centered={!previouslySearchedText}
            style={{
              marginTop: !previouslySearchedText ? '12%' : '0',
              marginBottom: '10px',
            }}
          >
            {!previouslySearchedText && (
              <Grid.Row>
                <div className="search-title">
                  Discover Your Library
                </div>
              </Grid.Row>
            )}

            <Grid.Row stretched>
              <Input
                action={{
                  icon: 'search',
                  onClick: this.handleSearchClick,
                  loading: searchPending,
                }}
                placeholder="Search for a book..."
                autoFocus
                size="massive"
                value={searchText}
                onChange={this.handleSearchInputChange}
                onKeyPress={this.handleKeyPress}
              />
            </Grid.Row>
          </Grid>
        </Container>

        {
          previouslySearchedText && (
            <React.Fragment>
              <Divider />

              <Container>
                <Grid style={{ marginBottom: '30px' }}>
                  <Grid.Column floated='left' width={5}>
                    {
                      !searchPending && (
                        <div style={{ fontSize: '19px', marginTop: '16px', fontStyle: 'italic' }}>
                          {
                            searchResult.totalItems !== 0
                              ? (
                                <div>
                                  {'Found '}
                                  <b>{searchResult.totalItems}</b>
                                  {` result${searchResult.totalItems !==1 ? 's' : ''}.`}
                                </div>
                              )
                              : <div>Nothing found.</div>
                          }
                        </div>
                      )
                    }
                  </Grid.Column>


                  {!searchPending && (
                    <Grid.Column width={5}>
                      {this.listPagination()}
                    </Grid.Column>
                  )}
                </Grid>
              </Container>

              {!paginationPending && (
                <Container>
                  <Grid>
                    {
                      searchResult.items.map(nextItem => (
                        <React.Fragment key={nextItem.id}>
                          <Grid.Row>
                            <Rail position='left'>
                            </Rail>

                            <BookSnippet data={nextItem} />

                            <div style={{ padding: '8px' }}>
                              <Popup
                                trigger={
                                  <Button
                                    icon={{
                                      name: 'file alternate',
                                      color: 'blue',
                                      size: 'large',
                                    }}
                                    circular
                                    basic
                                    onClick={this.handleAddToSaved(nextItem)}
                                  />
                                }
                                content="Save."
                                position="top left"
                              />

                              <Popup
                                trigger={
                                  <Button
                                    icon={{
                                      name: 'heart',
                                      color: 'pink',
                                      size: 'large',
                                    }}
                                    circular
                                    basic
                                    style={{ marginRight: '7px' }}
                                    onClick={this.handleAddToFavourites(nextItem)}
                                  />
                                }
                                content="Add to Favourites."
                                position="top left"
                              />
                            </div>
                          </Grid.Row>

                          <Divider />
                        </React.Fragment>
                      ))
                    }
                  </Grid>
                </Container>
              )}

              {!searchPending && (
                <Container>
                  <Grid style={{ marginBottom: '30px' }}>
                    <Grid.Column width={5} floated="right">
                      {this.listPagination()}
                    </Grid.Column>
                  </Grid>
                </Container>
              )}
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default connect(
  undefined,
  {
    addToSaved: actions.addToSaved,
    addToFavourites: actions.addToFavourites,
  },
)(webAPIProvider()(Discover))
