# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-07-17 10:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('model', '0008_remove_failure_match'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ClassifiedFailure',
            new_name='Classification',
        ),
        migrations.AlterField(
            model_name='classification',
            name='text_log_errors',
            field=models.ManyToManyField(related_name='classifications', through='model.TextLogErrorMatch', to='model.TextLogError'),
        ),
        migrations.AlterField(
            model_name='failureline',
            name='best_classification',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='best_for_lines', to='model.Classification'),
        ),
        migrations.AlterField(
            model_name='textlogerrormetadata',
            name='best_classification',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='best_for_errors', to='model.Classification'),
        ),
        migrations.RenameField(
            model_name='textlogerrormatch',
            old_name='classified_failure',
            new_name='classification',
        ),
        migrations.AlterUniqueTogether(
            name='textlogerrormatch',
            unique_together=set([('text_log_error', 'classification', 'matcher_name')]),
        ),
    ]
