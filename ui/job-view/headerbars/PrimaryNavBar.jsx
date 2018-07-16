import React from 'react';
import PropTypes from 'prop-types';

import { toShortDateStr } from '../../helpers/display';
import SecondaryNavBar from './SecondaryNavBar';
import { thAllResultStatuses, thEvents } from '../../js/constants';

export default class PrimaryNavBar extends React.Component {
  constructor(props) {
    super(props);

    const { $injector } = props;
    this.$rootScope = $injector.get('$rootScope');

    this.resultStatuses = thAllResultStatuses.slice();
    this.resultStatuses.splice(thAllResultStatuses.indexOf('runnable'), 1);


    this.state = {
      foo: 'bar',
    };
  }

  getRepoUrl(newRepoName) {
    const { history } = this.props;
    const location = history.location;
    const params = new URLSearchParams(location.hash.substring(location.hash.indexOf('?')));

    params.delete('selectedJob');
    params.set('repo', newRepoName);
    return `/#/jobs?${params.toString()}`;
  }

  clear() {

  }

  // move to JobView?
  tierToggled(tier) {
    const { jobFilters, tiers } = this.props;

    jobFilters.toggleFilters('tier', [tier], tiers[tier]);
    this.$rootScope.$emit(thEvents.recalculateUnclassified);
  }

  isSingleTierSelected() {

  }

  isFilterOn(field) {
    const { jobFilters } = this.props;

    return [
      ...jobFilters.getResultStatusArray(),
      ...jobFilters.getClassifiedStateArray(),
    ].includes(field);
  }

  render() {
    const {
      notifications, jobFilters, groupedRepos, tiers, pinJobs,
      updateButtonClick, serverChanged, $injector,
    } = this.props;

    console.log('groupedRepos', groupedRepos);

    return (
      <div id="global-navbar-container">
        <div id="th-global-top-nav-panel">
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
                  <li><a href="/perf.html" className="dropdown-item">Perfherder</a></li>
                  <li><a href="/intermittent-failures.html" className="dropdown-item">Intermittent Failures</a></li>
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
                      {!!notifications.length && <button
                        className="btn btn-xs btn-light-bordered notification-dropdown-btn"
                        title="Clear all notifications"
                        onClick={this.clear}
                      >Clear all</button>}
                    </li>
                    {!notifications.length && <li>
                      <span>No recent notifications</span>
                    </li>}
                    {notifications.map(notification => (
                      <li
                        className="notification-dropdown-line"
                        ng-switch
                        on="notification.severity"
                        key={notification.message}
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
                  >
                    <li role="presentation" className="dropdown-header">Buildbot</li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="https://secure.pub.build.mozilla.org/buildapi/pending"
                        target="_blank"
                        rel="noopener noreferrer"
                      >BuildAPI: Pending</a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="https://secure.pub.build.mozilla.org/buildapi/running"
                        target="_blank"
                        rel="noopener noreferrer"
                      >BuildAPI: Running</a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="https://www.hostedgraphite.com/da5c920d/86a8384e-d9cf-4208-989b-9538a1a53e4b/grafana2/#/dashboard/db/ec2-dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                      >EC2 Dashboard</a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="https://secure.pub.build.mozilla.org/builddata/reports/slave_health/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >Slave Health</a>
                    </li>
                    <li role="presentation" className="dropdown-divider" />
                    <li role="presentation" className="dropdown-header">Other</li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="https://mozilla-releng.net/treestatus"
                        target="_blank"
                        rel="noopener noreferrer"
                      >TreeStatus</a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="https://tools.taskcluster.net/diagnostics"
                        target="_blank"
                        rel="noopener noreferrer"
                      >TaskCluster</a>
                    </li>

                  </ul>
                </span>

                {/* Repos menu */}
                <span ng-controller="RepositoryMenuCtrl">
                  <span className="dropdown">
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
                        {groupedRepos.map(group => (
                          <span className="repogroup dropdown-item col" key={group.name}>
                            <li
                              role="presentation"
                              className="dropdown-header"
                              title={group.name}
                            >{group.name} <span
                              className="fa fa-info-circle"
                            />
                            </li>
                            {group.repos.map(repo => (<li key={repo.name}>
                              <a
                                title="Open repo"
                                className="dropdown-link"
                                href={this.getRepoUrl(repo.name)}
                              >{repo.name}</a>
                            </li>))}
                          </span>
                        ))}
                      </ul>
                    </span>
                  </span>
                </span>

                {/* Toggle Tiers filter Button */}
                <span className="dropdown">
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
                      <li key={tier}>
                        <div>
                          <label
                            title={(this.isSingleTierSelected() && tiers[tier] === true) ? 'Must have at least one tier selected at all times' : ''}
                            className="dropdown-item"
                          >
                            <input
                              id="tier-checkbox"
                              type="checkbox"
                              className={`mousetrap ${(this.isSingleTierSelected() && tiers[tier] === true) ? 'disabled' : ''}`}
                              ng-model="tiers[tier]"
                              ng-disabled=""
                              onChange={() => this.tierToggled(tier)}
                              value={`tier ${tier}`}
                            />
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </span>

                {/* Filters Menu */}
                <span>
                  <span className="dropdown">
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
                        {this.resultStatuses.map(filterName => (
                          <span key={filterName}>
                            <span>
                              <label className="dropdown-item">
                                <input
                                  type="checkbox"
                                  className="mousetrap"
                                  id={filterName}
                                  checked="isFilterOn(filterName)"
                                  onChange={() => jobFilters.toggleResultStatuses([filterName])}
                                  value={filterName}
                                />
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
                          checked={this.isFilterOn('classified')}
                          onChange={() => jobFilters.toggleClassifiedFilter('classified')}
                          value="classified"
                        />
                      </label>
                      <label className="dropdown-item">
                        <input
                          type="checkbox"
                          id="unclassified"
                          checked={this.isFilterOn('unclassified')}
                          onChange={() => jobFilters.toggleClassifiedFilter('unclassified')}
                          value="unclassified"
                        />
                      </label>
                      <li className="dropdown-divider separator" />
                      <li
                        title="Pin all jobs that pass the global filters"
                        className="dropdown-item"
                        onClick={pinJobs}
                      >Pin all showing</li>
                      <li
                        title="Show only superseded jobs"
                        className="dropdown-item"
                        onClick={jobFilters.setOnlySuperseded}
                      >Superseded only</li>
                      <li
                        title="Reset to default status filters"
                        className="dropdown-item"
                        onClick={jobFilters.resetNonFieldFilters}
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
                {/* <login on-user-change="$root.user = $event.user" /> */}
              </span>

            </div>
            <SecondaryNavBar
              updateButtonClick={updateButtonClick}
              serverChanged={serverChanged}
              $injector={$injector}
            />
          </nav>
        </div>
      </div>
    );
  }
}

PrimaryNavBar.propTypes = {
  $injector: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  jobFilters: PropTypes.object.isRequired,
  groupedRepos: PropTypes.object.isRequired,
  tiers: PropTypes.array.isRequired,
  updateButtonClick: PropTypes.func.isRequired,
  pinJobs: PropTypes.func.isRequired,
  serverChanged: PropTypes.bool.isRequired,
};
