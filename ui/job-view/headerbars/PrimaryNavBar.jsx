import React from 'react';
import PropTypes from 'prop-types';

import { toShortDateStr } from '../../helpers/display';
import SecondaryNavBar from './SecondaryNavBar';

export default class PrimaryNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      foo: 'bar',
    };
  }

  render() {
    const {
      notifications, jobFilters, groupedRepos, tiers, resultStatuses,
      updateButtonClick, serverChanged
    } = this.props;

    return (
      <nav id="th-global-navbar" className="navbar navbar-dark">
        <div id="th-global-navbar-top">

          {/* Logo Menu */}
          <span className="dropdown">
            <button
              id="th-logo"
              title="Treeherder services"
              data-toggle="dropdown"
              className="btn btn-view-nav dropdown-toggle"
            >
              <img src="../../img/treeherder-logo.png" alt="Treeherder" />
            </button>
            <ul className="dropdown-menu" role="menu" aria-labelledby="th-logo">
              <li><a href="perf.html" className="dropdown-item">Perfherder</a></li>
              <li><a href="intermittent-failures.html" className="dropdown-item">Intermittent Failures</a></li>
            </ul>
          </span>

          <span className="navbar-right">
            {/* Notifications Menu */}
            <span className="dropdown" ng-controller="NotificationCtrl">
              <button
                id="notificationLabel"
                title="Recent notifications"
                data-toggle="dropdown"
                className="btn btn-view-nav nav-menu-btn"
              >
                <span className="fa fa-bell-o lightgray" />
              </button>
              <ul
                id="notification-dropdown"
                className="dropdown-menu nav-dropdown-menu-right"
                role="menu"
                aria-labelledby="notificationLabel"
              >
                <li
                  role="presentation"
                  className="dropdown-header"
                  title="Notifications"
                >Recent notifications
                  <button
                    className="btn btn-xs btn-light-bordered notification-dropdown-btn"
                    title="Clear all notifications"
                    ng-show="notifications().length"
                    ng-click="clear()"
                  >Clear all</button>
                </li>
                <li ng-show="!notifications().length">
                  <span>No recent notifications</span>
                </li>
                {notifications().map(notification => (
                  <li
                    className="notification-dropdown-line"
                    ng-switch
                    on="notification.severity"
                  >
                    <span title={`${notification.message} ${notification.linkText}`}>
                      <span ng-switch-when="danger" className="fa fa-ban text-danger" />
                      <span ng-switch-when="warning" className="fa fa-warning text-warning" />
                      <span ng-switch-when="info" className="fa fa-info-circle text-info" />
                      <span ng-switch-when="success" className="fa fa-check text-success" />
                      <span ng-switch-default />
                      <small className="text-muted">{toShortDateStr(notification.created)}</small>
                      {notification.message}
                      <a
                        ng-if="true"
                        target="_blank"
                        rel="noopener"
                        ng-href={notification.url}
                      >{notification.linkText}</a>
                    </span>
                  </li>
                ))}
              </ul>
            </span>

            {/* Infra menu */}
            <span className="dropdown">
              <button
                id="infraLabel"
                title="Infrastructure status"
                data-toggle="dropdown"
                className="btn btn-view-nav nav-menu-btn dropdown-toggle"
              >Infra</button>
              <ul
                id="infra-dropdown"
                className="dropdown-menu nav-dropdown-menu-right container"
                role="menu"
                aria-labelledby="infraLabel"
                ng-include="'partials/main/thInfraMenu.html'"
              />
            </span>

            {/* Repos menu */}
            <span ng-controller="RepositoryMenuCtrl">
              <span th-checkbox-dropdown-container className="dropdown">
                <button
                  id="repoLabel"
                  title="Watch a repo"
                  data-toggle="dropdown"
                  className="btn btn-view-nav nav-menu-btn dropdown-toggle"
                >Repos</button>
                <span
                  id="repo-dropdown"
                  className="dropdown-menu nav-dropdown-menu-right container"
                >
                  <ul
                    className="checkbox-dropdown-menu row"
                    role="menu"
                    aria-labelledby="repoLabel"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {groupedRepos.map(({ group }) => (
                      <span className="repogroup dropdown-item col">
                        <li
                          role="presentation"
                          className="dropdown-header"
                          title={group.repos[0].repository_group.description}
                        >{group.name}
                          {!!group.repos[0].repository_group.description && <span
                            className="fa fa-info-circle"
                          />}
                        </li>
                        <th-repo-menu-item
                          ng-repeat="repo in group.repos | orderBy : 'name'"
                        />
                        {/* <div ng-if=$odd className="w-100" /> */}
                      </span>
                    ))}
                  </ul>
                </span>
              </span>
            </span>

            {/* Toggle Tiers filter Button */}
            <span th-checkbox-dropdown-container className="dropdown">
              <span
                id="tierLabel"
                role="button"
                title="Show/hide job tiers"
                data-toggle="dropdown"
                className="btn btn-view-nav btn-sm nav-menu-btn dropdown-toggle"
              >Tiers</span>
              <ul
                className="dropdown-menu checkbox-dropdown-menu"
                role="menu"
              >
                {jobFilters.tiers.map(tier => (
                  <li>
                    <div>
                      <label
                        title={(this.isSingleTierSelected() && tiers[tier] === true) ? 'Must have at least one tier selected at all times' : ''}
                        className="dropdown-item"
                      >
                        <input
                          id="tier-checkbox"
                          type="checkbox"
                          className="mousetrap"
                          ng-model="tiers[tier]"
                          ng-disabled="isSingleTierSelected() && tiers[tier] == true"
                          ng-change="tierToggled(tier)"
                        >tier {tier}</input>
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </span>

            {/* Filters Menu */}
            <span>
              <span th-checkbox-dropdown-container className="dropdown">
                <button
                  id="filterLabel"
                  title="Set filters"
                  data-toggle="dropdown"
                  className="btn btn-view-nav nav-menu-btn dropdown-toggle"
                >Filters</button>
                <ul
                  id="filter-dropdown"
                  className="dropdown-menu nav-dropdown-menu-right checkbox-dropdown-menu"
                  role="menu"
                  aria-labelledby="filterLabel"
                >
                  <li>
                    {resultStatuses.map(filterName => (
                      <span>
                        <span>
                          <label className={`${checkClass} dropdown-item`}>
                            <input
                              type="checkbox"
                              className="mousetrap"
                              id={filterName}
                              ng-checked="isFilterOn(filterName)"
                              ng-click="jobFilters.toggleResultStatuses([filterName])"
                            > {filterName}</input>
                          </label>
                        </span>
                      </span>
                    ))}
                  </li>
                  <li className="dropdown-divider separator" />
                  <label className="dropdown-item">
                    <input
                      type="checkbox"
                      id="classified"
                      ng-checked="isFilterOn('classified')"
                      ng-click="jobFilters.toggleClassifiedFilter('classified')"
                    > classified</input>
                  </label>
                  <label className="dropdown-item">
                    <input
                      type="checkbox"
                      id="unclassified"
                      ng-checked="isFilterOn('unclassified')"
                      ng-click="jobFilters.toggleClassifiedFilter('unclassified')"
                    > un-classified</input>
                  </label>
                  <li className="dropdown-divider separator" />
                  <li
                    title="Pin all jobs that pass the global filters"
                    className="dropdown-item"
                    ng-click="pinJobs()"
                  >Pin all showing</li>
                  <li
                    title="Show only superseded jobs"
                    className="dropdown-item"
                    ng-click="jobFilters.setOnlySuperseded()"
                  >Superseded only</li>
                  <li
                    title="Reset to default status filters"
                    className="dropdown-item"
                    ng-click="jobFilters.resetNonFieldFilters()"
                  >Reset</li>
                </ul>
              </span>
            </span>

            {/*  Help Menu */}
            <span id="help-menu" className="dropdown">
              <button
                id="helpLabel"
                title="Treeherder help"
                data-toggle="dropdown"
                className="btn btn-view-nav nav-help-btn dropdown-toggle"
              >
                <span className="fa fa-question-circle lightgray nav-help-icon" />
              </button>
              <ul
                className="dropdown-menu nav-dropdown-menu-right icon-menu"
                role="menu"
                aria-labelledby="helpLabel"
                ng-include="'partials/main/thHelpMenu.html'"
              />
            </span>

            {/* Login/Register Button */}
            <login on-user-change="$root.user = $event.user" />
          </span>

        </div>
        <SecondaryNavBar
          updateButtonClick={updateButtonClick}
          server-changed={serverChanged}
        />
      </nav>
    );
  }
}

PrimaryNavBar.propTypes = {
  notifications: PropTypes.array.isRequired,
  jobFilters: PropTypes.object.isRequired,
  groupedRepos: PropTypes.object.isRequired,
  tiers: PropTypes.array.isRequired,
  resultStatuses: PropTypes.array.isRequired,
  updateButtonClick: PropTypes.func.isRequired,
  serverChanged: PropTypes.bool.isRequired,
};
