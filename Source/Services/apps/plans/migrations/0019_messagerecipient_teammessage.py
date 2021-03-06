# Generated by Django 2.0.7 on 2019-02-02 06:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0006_merge_20181005_1359'),
        ('plans', '0018_auto_20190125_1839'),
    ]

    operations = [
        migrations.CreateModel(
            name='MessageRecipient',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('last_update', models.DateTimeField(default=django.utils.timezone.now)),
                ('members', models.ManyToManyField(related_name='message_recipients', to='core.EmployeeProfile')),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='message_recipients', to='plans.CarePlan')),
            ],
            options={
                'verbose_name': 'Message Recipient',
                'verbose_name_plural': 'Message Recipients',
                'ordering': ('-last_update',),
            },
        ),
        migrations.CreateModel(
            name='TeamMessage',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('recipients', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='plans.MessageRecipient')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Team Message',
                'verbose_name_plural': 'Team Messages',
                'ordering': ('created',),
            },
        ),
    ]
