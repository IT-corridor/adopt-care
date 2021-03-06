# Generated by Django 2.0.7 on 2018-10-26 00:50

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0011_auto_20181017_1335'),
    ]

    operations = [
        migrations.CreateModel(
            name='CarePlanTemplateType',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=128)),
                ('acronym', models.CharField(max_length=16)),
            ],
            options={
                'verbose_name': 'Care Plan Template Type',
                'verbose_name_plural': 'Care Plan Template Types',
                'ordering': ('-created',),
            },
        ),
    ]
