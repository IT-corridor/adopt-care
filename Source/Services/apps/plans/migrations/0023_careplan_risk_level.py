# Generated by Django 2.0.7 on 2019-02-11 22:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0022_auto_20190208_2208'),
    ]

    operations = [
        migrations.AddField(
            model_name='careplan',
            name='risk_level',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
