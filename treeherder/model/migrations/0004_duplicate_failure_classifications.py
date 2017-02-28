# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-23 16:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('model', '0003_taskcluster_taskid_not_unique'),
    ]

    operations = [
        migrations.CreateModel(
            name='TextLogErrorMatch',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('score', models.DecimalField(blank=True, decimal_places=2, max_digits=3, null=True)),
                ('classified_failure', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='error_matches', to='model.ClassifiedFailure')),
                ('matcher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='model.Matcher')),
            ],
            options={
                'db_table': 'text_log_error_match',
                'verbose_name_plural': 'text log error matches',
            },
        ),
        migrations.CreateModel(
            name='TextLogErrorMetadata',
            fields=[
                ('text_log_error', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='_metadata', serialize=False, to='model.TextLogError')),
                ('best_is_verified', models.BooleanField(default=False)),
                ('best_classification', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='best_for_errors', to='model.ClassifiedFailure')),
                ('failure_line', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='text_log_error_metadata', to='model.FailureLine')),
            ],
            options={
                'db_table': 'text_log_error_metadata',
            },
        ),
        migrations.AddField(
            model_name='textlogerrormatch',
            name='text_log_error',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='model.TextLogError'),
        ),
        migrations.AddField(
            model_name='classifiedfailure',
            name='text_log_errors',
            field=models.ManyToManyField(related_name='classified_failures', through='model.TextLogErrorMatch', to='model.TextLogError'),
        ),
        migrations.AlterUniqueTogether(
            name='textlogerrormatch',
            unique_together=set([('text_log_error', 'classified_failure', 'matcher')]),
        ),
    ]
