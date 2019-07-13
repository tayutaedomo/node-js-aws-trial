#!/usr/bin/env node

'use strict';


if (require.main === module) {
  console.log('Run buildpack_task_trial');
  console.log('[LOG] env.HOME', process.env.HOME);
  console.log('[LOG] env.NODE_ENV', process.env.NODE_ENV);
  console.log('[LOG] env.BUILDPACK_TASK_DUMMY', process.env.BUILDPACK_TASK_DUMMY);
  console.log('[LOG] __dirname', __dirname);
}

