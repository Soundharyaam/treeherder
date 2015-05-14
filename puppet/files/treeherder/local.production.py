# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, you can obtain one at http://mozilla.org/MPL/2.0/.

import logging

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'standard': {
            'format': "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'standard'
        },
        'logfile': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/treeherder/treeherder.log',
            'maxBytes': 5 * 1024 * 1024,
            'backupCount': 2,
            'formatter': 'standard',
        },
        'syslog': {
            'level': 'DEBUG',
            'class': 'logging.handlers.SysLogHandler',
            'formatter': 'standard',
            'facility': logging.handlers.SysLogHandler.LOG_LOCAL7,
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'logfile', 'syslog'],
            'level': 'INFO',
            'propagate': True,
        },
        'treeherder': {
            'handlers': ['console', 'logfile', 'syslog'],
            'level': 'DEBUG',
            'propagate': False,
        }
    }
}
