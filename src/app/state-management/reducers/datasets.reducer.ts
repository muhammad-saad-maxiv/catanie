import { Action } from '@ngrx/store';
import { Dataset } from 'shared/sdk/models';

import {
    FILTER_UPDATE,
    FILTER_UPDATE_COMPLETE,

    SELECT_CURRENT,
    SELECTED_UPDATE,
    TOTAL_UPDATE,
    FILTER_VALUE_UPDATE,

    CURRENT_BLOCKS_COMPLETE,
    SEARCH_ID_COMPLETE,
    SELECTED_DATABLOCKS_COMPLETE,
    SEARCH_COMPLETE,
    ADD_GROUPS_COMPLETE,

    SELECT_DATASET,
    SelectDatasetAction,
    DeselectDatasetAction,
    DESELECT_DATASET,
    CHANGE_PAGE,
    ChangePageAction,
    SORT_BY_COLUMN,
    SortByColumnAction,
    CLEAR_SELECTION,
    SetViewModeAction,
    SET_VIEW_MODE,
    CLEAR_FACETS,
    FETCH_DATASETS_COMPLETE,
    FETCH_FACET_COUNTS_COMPLETE,
    ADD_LOCATION_FILTER,
    AddLocationFilterAction,
    RemoveLocationFilterAction,
    REMOVE_LOCATION_FILTER,
    ADD_GROUP_FILTER,
    AddGroupFilterAction,
    SET_TYPE_FILTER,
    ADD_KEYWORD_FILTER,
    AddKeywordFilterAction,
    SetTypeFilterAction,
    REMOVE_GROUP_FILTER,
    RemoveGroupFilterAction,
    REMOVE_KEYWORD_FILTER,
    RemoveKeywordFilterAction,
    SetSearchTermsAction,
    SET_SEARCH_TERMS,
    FETCH_DATASETS,
    FETCH_FACET_COUNTS,
    SetTextFilterAction,
    SET_TEXT_FILTER,
    FetchDatasetsCompleteAction,
    FetchFacetCountsCompleteAction,
    FETCH_FACET_COUNTS_FAILED,
    FETCH_DATASETS_FAILED,
} from 'state-management/actions/datasets.actions';

import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';

export function datasetsReducer(state: DatasetState = initialDatasetState, action: Action): DatasetState {
    if (action.type.indexOf('[Dataset]') !== -1) {
        console.log('Action came in! ' + action.type);
    }

    switch (action.type) {
        case FETCH_DATASETS: {
            return {...state, datasetsLoading: true};
        }

        case FETCH_DATASETS_COMPLETE: {
            const datasets = (action as FetchDatasetsCompleteAction).datasets;
            return {...state, datasets, datasetsLoading: false};
        }

        case FETCH_DATASETS_FAILED: {
            return {...state, datasetsLoading: false};
        }

        case FETCH_FACET_COUNTS: {
            return {...state, facetCountsLoading: true};
        }

        case FETCH_FACET_COUNTS_COMPLETE: {
            const {facetCounts, allCounts} = action as FetchFacetCountsCompleteAction;
            return {...state, facetCounts, totalCount: allCounts, facetCountsLoading: false};
        }

        case FETCH_FACET_COUNTS_FAILED: {
            return {...state, facetCountsLoading: false};
        }

        case FILTER_UPDATE: {
            const f = action['payload'];
            const group = f['ownerGroup'];

            if (group && !Array.isArray(group) && group.length > 0) {
                f['ownerGroup'] = [group];
            }

            return {...state, filters: f, datasetsLoading: true, selectedSets: []};
        }

        case SET_SEARCH_TERMS: {
            const {terms} = (action as SetSearchTermsAction);
            return {...state, searchTerms: terms};
        }

        case ADD_LOCATION_FILTER: {
            const {location} = action as AddLocationFilterAction;
            const creationLocation = state
                    .filters
                    .creationLocation
                    .concat(location)
                    .filter((val, i, self) => self.indexOf(val) === i); // Unique
            const filters = {...state.filters, creationLocation, skip: 0};
            return {...state, filters};
        }

        case REMOVE_LOCATION_FILTER: {
            const {location} = action as RemoveLocationFilterAction;
            const creationLocation = state.filters.creationLocation.filter(_ => _ !== location);
            const filters = {...state.filters, creationLocation, skip: 0};
            return {...state, filters};
        }
        
        case ADD_GROUP_FILTER: {
            const {group} = action as AddGroupFilterAction;
            const ownerGroup = state
                .filters
                .ownerGroup
                .concat(group)
                .filter((val, i, self) => self.indexOf(val) === i); // Unique
            const filters = {...state.filters, ownerGroup, skip: 0};
            return {...state, filters};
        }

        case REMOVE_GROUP_FILTER: {   
            const {group} = action as RemoveGroupFilterAction;
            const ownerGroup = state.filters.ownerGroup.filter(_ => _ !== group);
            const filters = {...state.filters, ownerGroup, skip: 0};
            return {...state, filters};
        }
        
        case SET_TYPE_FILTER: {
            const {datasetType} = action as SetTypeFilterAction;
            const filters = {...state.filters, type: datasetType, skip: 0};
            return {...state, filters};
        }

        case SET_TEXT_FILTER: {
            const {text} = action as SetTextFilterAction;
            const filters = {...state.filters, text, skip: 0};
            return {...state, filters};
        }
        
        case ADD_KEYWORD_FILTER: {
            const {keyword} = action as AddKeywordFilterAction;
            const keywords = state
                .filters
                .keywords
                .concat(keyword)
                .filter((val, i, self) => self.indexOf(val) === i); // Unique
            const filters = {...state.filters, keywords, skip: 0};
            return {...state, filters};
        }

        case REMOVE_KEYWORD_FILTER: {   
            const {keyword} = action as RemoveKeywordFilterAction;
            const keywords = state.filters.keywords.filter(_ => _ !== keyword);
            const filters = {...state.filters, keywords, skip: 0};
            return {...state, filters};
        }

        case CLEAR_FACETS: {
            const filters = {...initialDatasetState.filters, skip: 0};
            return {...state, filters};
        }

        case CHANGE_PAGE: {
            const {page, limit} = (action as ChangePageAction);
            const skip = page * limit;
            const filters = {...state.filters, skip, limit};
            return {
                ...state,
                datasetsLoading: true,
                filters
            };
        }

        case SORT_BY_COLUMN: {
            const {column, direction} = action as SortByColumnAction;
            const sortField = column + (direction ? ':' + direction : '');
            const filters = {...state.filters, sortField, skip: 0};
            return {...state, filters, datasetsLoading: true};
        }

        case SET_VIEW_MODE: {
            const {mode} = action as SetViewModeAction;
            if (state.mode === mode) {
                return state;
            } else {
                return {...state, mode, datasetsLoading: true, facetCountsLoading: true};
            }
        }

        case SEARCH_COMPLETE: {
            const datasets = <Dataset[]>action['payload'];
            return {...state, datasets, datasetsLoading: false};
        }

        case ADD_GROUPS_COMPLETE: {
            const ownerGroup = action['payload'];
            const filters = {...state.filters, ownerGroup};
            return {...state, filters};
        }

        case FILTER_VALUE_UPDATE: {
            return {...state, facetCountsLoading: true};
        }
        case FILTER_UPDATE_COMPLETE: {
            const filters = action['payload'];
            return {...state, filters, facetCountsLoading: false};
        }

        case SELECT_CURRENT:
        case CURRENT_BLOCKS_COMPLETE:
        case SEARCH_ID_COMPLETE: {
            const currentSet = <Dataset>action['payload'];
            return {...state, currentSet};
        }

        case SELECTED_DATABLOCKS_COMPLETE:
        case SELECTED_UPDATE: {
            const selectedSets = <Dataset[]>action['payload'];
            return {...state, selectedSets};
        }

        case SELECT_DATASET: {
            const dataset = (action as SelectDatasetAction).dataset;
            const selectedSets = state.selectedSets.concat(dataset);
            return {...state, selectedSets};
        }

        case DESELECT_DATASET: {
            const dataset = (action as DeselectDatasetAction).dataset;
            const selectedSets = state.selectedSets.filter(selectedSet => selectedSet.pid !== dataset.pid);
            return {...state, selectedSets};
        }

        case CLEAR_SELECTION: {
            return {...state, selectedSets: []};
        }

        // TODO handle failed actions
        default: {
            return state;
        }
    }
}
