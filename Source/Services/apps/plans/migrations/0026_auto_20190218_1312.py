# Generated by Django 2.0.7 on 2019-02-18 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0025_careplan_is_billed'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='careplan',
            name='next_checkin',
        ),
        migrations.AddField(
            model_name='careteammember',
            name='next_checkin',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
