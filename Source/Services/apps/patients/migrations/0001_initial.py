# Generated by Django 2.0.7 on 2018-07-23 15:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PatientDiagnosis',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=20)),
                ('date_identified', models.DateField(blank=True, null=True)),
                ('diagnosing_practitioner', models.CharField(blank=True, max_length=140, null=True)),
                ('facility', models.CharField(blank=True, max_length=140, null=True)),
                ('diagnosis', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Diagnosis')),
            ],
            options={
                'verbose_name_plural': 'patient diagnosis',
                'ordering': ('patient', 'diagnosis'),
            },
        ),
        migrations.CreateModel(
            name='PatientProcedure',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_of_procedure', models.DateField(blank=True, null=True)),
                ('attending_practitioner', models.CharField(blank=True, max_length=140, null=True)),
                ('facility', models.CharField(blank=True, max_length=140, null=True)),
            ],
            options={
                'ordering': ('patient', 'procedure'),
            },
        ),
        migrations.CreateModel(
            name='PatientProfile',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('pre-potential', 'Pre Potential'), ('potential', 'Potential'), ('invited', 'Invited'), ('delinquent', 'Delinquent'), ('inactive', 'Inactive'), ('active', 'Active')], default='pre-potential', max_length=20)),
                ('diagnosis', models.ManyToManyField(blank=True, to='patients.PatientDiagnosis')),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Facility')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='patient_profile', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('user',),
            },
        ),
        migrations.CreateModel(
            name='ProblemArea',
            fields=[
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_identified', models.DateField(blank=True, null=True)),
                ('name', models.CharField(max_length=140)),
                ('description', models.CharField(blank=True, max_length=512, null=True)),
                ('identified_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.EmployeeProfile')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patients.PatientProfile')),
            ],
            options={
                'ordering': ('patient', 'name'),
            },
        ),
        migrations.AddField(
            model_name='patientprocedure',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patients.PatientProfile'),
        ),
        migrations.AddField(
            model_name='patientprocedure',
            name='procedure',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Procedure'),
        ),
        migrations.AddField(
            model_name='patientdiagnosis',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patients.PatientProfile'),
        ),
    ]
