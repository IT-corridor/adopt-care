# Generated by Django 2.0.7 on 2019-06-01 12:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_employeerole'),
        ('tasks', '0064_careplanteamtemplate_custom_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='careplanteamtemplate',
            name='custom_roles',
            field=models.ManyToManyField(blank=True, related_name='plan_team_templates', to='core.ProviderRole'),
        ),
    ]
