# Generated by Django 2.0.7 on 2018-09-11 00:28

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('patients', '0003_remove_patientmedication_refills'),
        ('core', '0004_symptom'),
    ]

    operations = [
        migrations.CreateModel(
            name='CarePlanInstance',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='care_plans', to='patients.PatientProfile')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CarePlanTemplate',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=120)),
                ('type', models.CharField(choices=[('rpm', 'Remote Patient Management'), ('bhi', 'Behavioral Health Initiative'), ('cocm', 'Psychiatric Collaberative Care Management'), ('ccm', 'Chronic Care Management'), ('cccm', 'Complex Chronic Care Management'), ('tcm', 'Transitional Care Management')], max_length=10)),
                ('duration_weeks', models.IntegerField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CareTeamMember',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('employee_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_roles', to='core.EmployeeProfile')),
                ('plan_instance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='care_team_members', to='plans.CarePlanInstance')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.ProviderRole')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GoalTemplate',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=140)),
                ('description', models.CharField(max_length=240)),
                ('focus', models.CharField(max_length=140)),
                ('start_on_day', models.IntegerField()),
                ('duration_weeks', models.IntegerField(help_text='If below 0, the goal will continue until the plan ends.')),
                ('plan_template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='goals', to='plans.CarePlanTemplate')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InfoMessage',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('text', models.CharField(blank=True, max_length=512, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='InfoMessageQueue',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=120)),
                ('type', models.CharField(choices=[('education', 'Education'), ('support', 'Support'), ('medication', 'Medication')], max_length=40)),
                ('plan_template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='info_message_queues', to='plans.CarePlanTemplate')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PlanConsent',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('verbal_consent', models.BooleanField(default=False)),
                ('discussed_co_pay', models.BooleanField(default=False)),
                ('seen_within_year', models.BooleanField(default=False)),
                ('will_use_mobile_app', models.BooleanField(default=False)),
                ('will_interact_with_team', models.BooleanField(default=False)),
                ('will_complete_tasks', models.BooleanField(default=False)),
                ('plan_instance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='plans.CarePlanInstance')),
            ],
            options={
                'ordering': ('created',),
            },
        ),
        migrations.AddField(
            model_name='infomessage',
            name='queue',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='plans.InfoMessageQueue'),
        ),
        migrations.AddField(
            model_name='careplaninstance',
            name='plan_template',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='plans.CarePlanTemplate'),
        ),
    ]
