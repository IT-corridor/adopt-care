# -*- coding: utf-8 -*-
# Generated by Django 1.10.8 on 2018-06-21 21:27
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='patientdiagnosis',
            options={'verbose_name_plural': 'patient diagnosis'},
        ),
        migrations.RemoveField(
            model_name='patientprofile',
            name='gender',
        ),
    ]
