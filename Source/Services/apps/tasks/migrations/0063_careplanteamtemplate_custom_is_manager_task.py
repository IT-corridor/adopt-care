# Generated by Django 2.0.7 on 2019-05-18 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0062_auto_20190517_2125'),
    ]

    operations = [
        migrations.AddField(
            model_name='careplanteamtemplate',
            name='custom_is_manager_task',
            field=models.NullBooleanField(),
        ),
    ]
